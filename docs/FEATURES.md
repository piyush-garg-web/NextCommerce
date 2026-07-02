# Features Deep-Dive

This document details the functional behavior, logic flow, and implementation mechanics of the core features in this Next.js E-Commerce platform.

---

## 1. Custom Authentication & OTP Verification

Rather than relying on NextAuth, the system implements a secure, custom auth cycle using cookies, `jose`, and NodeMailer.

```
[Register Form] ---> Generate 6-Digit OTP ---> Write to DB (TTL: 5m)
                         |
                         v
             Send Email via Nodemailer
                         |
                         v
[OTP Verify Input] ---> Verify Match ---> Activate User (isEmailVerified: true)
```

### Cookie-based Sessions
When a user logs in, the server generates a JSON Web Token (JWT) payload:
```javascript
const payload = { userId: user._id, role: user.role, email: user.email };
```
It is signed using a base64-encoded `SECRET_KEY` and appended as an `access_token` in HTTP-Only cookies. The browser cannot access this cookie via JavaScript (defending against Cross-Site Scripting / XSS).

### Middleware Route Guards
`middleware.js` intercept requests to guarded routes:
* `/myaccount/:path*` (requires authentication role `'user'` or `'admin'`).
* `/admin/:path*` (strictly requires role `'admin'`).
* `/auth/:path*` (redirects logged-in sessions away from login/register pages back to the dashboards).

---

## 2. Server-Side Cart & Checkout Validation

A major security vulnerability in simple e-commerce apps is trusting client-submitted prices (e.g., modifying the price to $1 in the browser console before checkout). The checkout system mitigates this with double server-side guards.

1. **Cart Price Verification (`/api/cart-verification`)**:
   * Before generating the checkout, the frontend submits the active Redux cart array of `{ productId, variantId, qty }` to the backend.
   * The backend fetches the raw product and variant documents directly from MongoDB.
   * It recalculates the subtotal, discount, tax, and total amounts based strictly on DB records, rejecting the order if there's a discrepancy.

2. **Inventory Stock Checks**:
   * Ensures that the requested quantity `qty` does not exceed the current `stock` value stored inside the variant model.

3. **Razorpay Signature Audit (`/api/payment/save-order`)**:
   * When Razorpay completes a transaction, it returns a cryptographic signature.
   * The backend recalculates this signature using the Razorpay order ID, payment ID, and the server-side `RAZORPAY_KEY_SECRET`:
     ```javascript
     const verification = validatePaymentVerification({
         order_id: razorpay_order_id,
         payment_id: razorpay_payment_id
     }, razorpay_signature, process.env.RAZORPAY_KEY_SECRET);
     ```
   * If it checks out, the order is finalized and stock is decremented.

---

## 3. Product Variant Matrix

Products are configured with a parent-child variation framework.
* **Parent Product**: Contains common descriptors, slug, category, default pricing (for catalog fallback), and general description.
* **Child Product Variants**: Maps individual `color` and `size` combinations. Each variant features:
  * Unique `sku` identifier.
  * Individual `stock` count.
  * Distinct `mrp` and `sellingPrice` values.
  * Separate variant `media` array (e.g., displaying the red product variant only when the customer selects red).

---

## 4. Soft-Delete Trash Bin

To prevent permanent accidental deletions of data, the database uses a **soft-delete pattern**.

### Mechanism
All delete buttons in the admin interface trigger an API call that sets `deletedAt: new Date()` in Mongoose:
```javascript
const deleteProduct = await ProductModel.findByIdAndUpdate(id, { deletedAt: new Date() });
```

### The Admin Trash View
* **Standard Queries**: Public storefront search APIs filter active items using `{ deletedAt: null }`.
* **Trash Query**: The trash page inside the admin panel queries `{ deletedAt: { $ne: null } }`.
* **Actions**: Admins can either:
  1. **Restore**: Sets `deletedAt: null`, placing the product back in the live storefront catalog.
  2. **Purge**: Permanently deletes the document from MongoDB database memory.

---

## 5. Coupon Calculations

The checkout form supports dynamic discount application.
* **`minShoppingAmount`**: The coupon checks if the calculated subtotal is greater than the required threshold.
* **`validity`**: Verifies that `new Date()` is less than the coupon's expiration date.
* **`discountPercentage`**: Subtracts a percentage off the cart subtotal, capping the total order payment value dynamically.
