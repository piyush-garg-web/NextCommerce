# Application Security Architecture

This document outlines the security measures, authentication policies, data encryption practices, and query validations implemented across this e-commerce project.

---

## 1. Authentication & Session Security

### HTTP-Only Cookie Tokens
The application implements stateless JWT sessions. Upon login, the generated JWT token is sent as an `access_token` cookie with the following security attributes:
* **`HttpOnly`**: Blocks client-side JavaScript from accessing the cookie, preventing theft via Cross-Site Scripting (XSS) scripts.
* **`Secure`** (in production): Forces browsers to send the cookie only over encrypted HTTPS connections.
* **`SameSite=Strict`**: Mitigates Cross-Site Request Forgery (CSRF) vulnerability by preventing the cookie from being sent on cross-site requests.

### Next.js Route Guards
A unified `middleware.js` interceptor inspects access cookies:
* Role claims are decoded using the server-side `SECRET_KEY` via the `jose` library.
* Unauthenticated requests are immediately blocked and redirected to `/auth/login` before rendering pages.
* Direct URL access attempts to `/admin` routes by non-admin accounts are immediately rejected and redirected.

---

## 2. Cryptographic Passwords

Passphrases are never saved in plaintext format. The user model executes a pre-save trigger using `bcryptjs` to hash strings before committing them to the MongoDB cluster:
```javascript
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
```
* bcrypt uses an internal salt value, protecting passwords from database leaks and dictionary attacks.
* The password field is configured with `select: false` in Mongoose, excluding it from standard queries (e.g. `UserModel.find()`) unless explicitly requested.

---

## 3. Request Validation & Input Sanitization

To defend the backend against malicious payloads and NoSQL injections:
* **Zod Schemas (`lib/zodSchema.js`)**: All request bodies inside API routes are validated against schema constraints before database queries:
  ```javascript
  const schema = zschema.pick({ amount: true });
  const validate = schema.safeParse(payload);
  if (!validate.success) {
      return response(false, 400, 'Invalid fields', validate.error);
  }
  ```
* **Strict Type Safety**: Mongoose enforces strong types (e.g. forcing `amount` to be a Number, preventing payload attempts to pass query selectors like `{"$gt": 0}`).

---

## 4. Secure Payment Verification

Clients interact directly with Razorpay to execute payments, but the transaction must be validated server-side before updating the order status in the database.
* The backend computes an HMAC SHA256 signature using the Razorpay `order_id`, `payment_id`, and the private `RAZORPAY_KEY_SECRET`.
* This computed hash is compared against the client-submitted signature. If they do not match, the order is flagged as `unverified` and is not processed, blocking malicious client-side payment bypasses.

---

## 5. Signed Media Uploads

To avoid exposing administrative Cloudinary API keys on the frontend, the app utilizes **Signed Upload Signatures**:
1. The admin panel requests a signature from the backend: `/api/cloudinary-signature`.
2. The server signs the upload parameters using the private `CLOUDINARY_SECRET_KEY` and a timestamp.
3. The client uploads the asset directly to Cloudinary, passing this signature. The upload is rejected if it has been modified or expired.

---

## 6. Secure Error Handling

All route handlers wrap database operations inside try-catch filters. If a failure occurs, the controller logs it and returns a generic, secure message, hiding internal stack traces, DB credentials, or server directory details from the public response:
```javascript
export function catchError(error) {
    console.error(error);
    return response(false, 500, 'Something went wrong. Please try again.');
}
```
