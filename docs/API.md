# API Reference Manual

This document details the REST API endpoints available in the Next.js E-Commerce backend, including request/response payloads and authentication guards.

---

## 1. Authentication Endpoints

### Register User
* **Endpoint**: `POST /api/auth/register`
* **Auth Guard**: Public
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "janedoe@example.com",
    "password": "Password123"
  }
  ```
* **Description**: Checks for existing emails, creates a soft-disabled user, generates a 6-digit OTP, saves it in `otps` schema, and triggers a verification email via Nodemailer.

### Verify OTP
* **Endpoint**: `POST /api/auth/verifyotp`
* **Auth Guard**: Public
* **Request Body**:
  ```json
  {
    "email": "janedoe@example.com",
    "otp": "123456"
  }
  ```
* **Description**: Compares OTP. If correct and not expired, sets user field `isEmailVerified: true` and removes the OTP from database.

### Login User
* **Endpoint**: `POST /api/auth/login`
* **Auth Guard**: Public
* **Request Body**:
  ```json
  {
    "email": "janedoe@example.com",
    "password": "Password123"
  }
  ```
* **Response Header**: `Set-Cookie: access_token=<JWT_TOKEN>; HttpOnly; Path=/; Max-Age=...`
* **Response Body**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": { "name": "Jane Doe", "email": "janedoe@example.com", "role": "user" }
  }
  ```

### Logout User
* **Endpoint**: `POST /api/auth/logout`
* **Auth Guard**: Cookie Token Required
* **Description**: Clears the `access_token` cookie by setting expiration to past.

---

## 2. Storefront Catalogs & Filters

### List Products / Filter Search
* **Endpoint**: `GET /api/shop`
* **Auth Guard**: Public
* **Query Parameters**:
  * `category`: (Optional) Category Slug filter.
  * `search`: (Optional) Query term. Searches title and details using Fuse.js.
  * `sort`: (Optional) `price-asc`, `price-desc`, `newest`.
  * `page`: (Optional) Pagination index (default `1`).
* **Response**:
  ```json
  {
    "success": true,
    "products": [...],
    "totalPages": 5,
    "currentPage": 1
  }
  ```

### Single Product Details
* **Endpoint**: `GET /api/product?slug=product-slug`
* **Auth Guard**: Public
* **Response**: Returns product metadata, associated active variants, and user reviews.

---

## 3. Cart & Payment Gateways

### Cart Price Verification
* **Endpoint**: `POST /api/cart-verification`
* **Auth Guard**: Cookie Token Required
* **Request Body**: Array of client cart items with quantities.
* **Description**: Loops through database models to recalculate prices and inventory thresholds, preventing frontend request parameter tampering before checkout.

### Generate Razorpay Order ID
* **Endpoint**: `POST /api/payment/get-order-id`
* **Auth Guard**: Cookie Token Required
* **Request Body**:
  ```json
  {
    "amount": 2999
  }
  ```
* **Response Body**:
  ```json
  {
    "success": true,
    "message": "Order Id Generated",
    "data": "order_OkjshdGdy24Ghg"
  }
  ```
* **Description**: Connects to the Razorpay SDK and instantiates a payment order in INR. Returns the Razorpay `order_id` for use in the storefront checkout modal.

### Save Order (Payment Verification)
* **Endpoint**: `POST /api/payment/save-order`
* **Auth Guard**: Cookie Token Required
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "janedoe@example.com",
    "phone": "9876543210",
    "country": "India",
    "state": "Delhi",
    "city": "New Delhi",
    "pincode": "110001",
    "landmark": "Near Metro Station",
    "ordernote": "",
    "userId": "64b123...",
    "razorpay_payment_id": "pay_Okn12k3nKASDF",
    "razorpay_order_id": "order_OkjshdGdy24Ghg",
    "razorpay_signature": "abcdef123456...",
    "subtotal": 2999,
    "discount": 0,
    "couponDiscountAmount": 0,
    "totalAmount": 2999,
    "products": [
      {
        "productId": "64b543...",
        "variantId": "64b876...",
        "name": "Premium T-Shirt",
        "qty": 1,
        "mrp": 2999,
        "sellingPrice": 2999
      }
    ]
  }
  ```
* **Description**: Verifies signature authenticity using `razorpay/dist/utils/razorpay-utils`. If verification passes, saves order to database as `pending`, reduces inventory values, and emails user an invoice via Nodemailer.

---

## 4. Admin CRUD Endpoints

Protected by the custom Jose middleware. Blocked if cookie token role is not `'admin'`.

### Product CRUD
* **Endpoint**: `/api/product`
* **Methods**:
  * `POST`: Creates a product.
  * `PUT`: Updates product detail parameters.
  * `DELETE`: Sets `deletedAt` timestamp (Soft-delete).

### Product Variant CRUD
* **Endpoint**: `/api/product-variant`
* **Methods**:
  * `POST`: Creates color/size configuration linked to a parent product.
  * `PUT`: Updates quantities, SKUs, or media maps.
  * `DELETE`: Sets `deletedAt` (Soft-delete).

### Coupon CRUD
* **Endpoint**: `/api/coupon`
* **Methods**:
  * `POST`: Creates code string, discount percentage, minimum shopping amount threshold, and validity date.
  * `PUT`: Edits coupon attributes.
  * `DELETE`: Soft-deletes coupon.

### Media Cloudinary signature
* **Endpoint**: `GET /api/cloudinary-signature`
* **Description**: Generates secure cryptographic signatures for the admin client, allowing files to be directly uploaded to Cloudinary safely without exposing API keys.

---

## 5. Development Mock Seeder

* **Endpoint**: `GET /api/faker`
* **Auth Guard**: Admin only (or restricted to `development` environments)
* **Description**: Leverages `@faker-js/faker` to clear the database and inject dummy data (users, categories, products, variants, reviews, coupons) to facilitate instant UI layout testing.
