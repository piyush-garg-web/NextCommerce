# Architectural Architecture

This document describes the high-level architecture of the Next.js E-Commerce platform, explaining how the frontend, backend, database, and background services interact.

---

## 1. System Overview

The system is structured as a **monolithic Next.js application** utilizing the **App Router**. Next.js acts as both the client-side user interface (SPA) and the server-side API Gateway (REST APIs).

```mermaid
graph TD
    User([Customer / Admin]) <--> |HTTP/HTTPS| FE[Next.js App Router Frontend]
    FE <--> |State Management| Redux[Redux Toolkit & Redux Persist]
    FE <--> |Data Fetching| RQ[React Query & Axios]
    FE <--> |API Routes| BE[Next.js REST API Handlers]
    BE <--> |JWT Authentication & Guard| Middleware[Jose JWT Middleware]
    BE <--> |Mongoose ODM| DB[(MongoDB Database)]
    BE --> |Transactional Mail| Mail[Nodemailer SMTP]
    BE <--> |Signed Uploads & Assets| Cloudinary[Cloudinary CDN]
    FE <--> |Secure Client Checkout| Razorpay[Razorpay Gateway]
    BE <--> |Verify Signature| Razorpay
```

---

## 2. Frontend Layer

The frontend is constructed using **Next.js (App Router)** and styled using **Tailwind CSS v4** combined with **Material-UI (MUI)**.

### Directory Structure & Route Grouping
The client application is organized into route groups under `app/(root)`:
* **`app/(root)/(website)`**: Customer-facing pages including the shop catalog (`/shop`), product details (`/product/[slug]`), shopping cart (`/cart`), profile page (`/myaccount`), and order tracking (`/orders`).
* **`app/(root)/(admin)`**: Protected admin interface (`/admin/*`) containing dashboards, inventory listing tables, coupon grids, client details, and trash bins.
* **`app/(root)/auth`**: Login, registration, OTP email verification, and password reset routes.

### Client-Side State Management
1. **Redux Toolkit (`store/`)**:
   * Manages the active shopping cart state (`cartReducer`), containing product IDs, variants, quantities, and prices.
   * Leverages `redux-persist` to write the cart to `localStorage`, preventing data loss on browser refresh.
2. **React Query (`@tanstack/react-query`)**:
   * Used for fetching, caching, and synchronizing asynchronous server state (e.g., admin customer listings, review submissions, products list).
   * Prevents duplicate network requests.

---

## 3. Backend & API Layer

Next.js **Route Handlers** (`app/api/`) serve as a lightweight REST API.

### Database Connection Management
The database connection is established via Mongoose inside `lib/dbConnection.js`. To prevent exhausting MongoDB connections during Next.js Hot Module Replacement (HMR) in development, it caches the database connection globally:
```javascript
let cache = global.mongoose;
if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}
```
It also imports and pre-registers all Mongoose models upon connection to avoid compile-time model overwrite errors.

---

## 4. Key Architectural Flows

### A. Authentication & Route Guard Flow
The application implements custom stateless JWT authentication via HTTP-only cookies (`access_token`).

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Auth as /api/auth/login
    participant Mid as middleware.js
    participant DB as MongoDB

    User->>Auth: POST credentials (email, password)
    Auth->>DB: Check user & verify hashed password
    DB-->>Auth: User data & role (admin/user)
    Note over Auth: Sign JWT token using 'jose' and process.env.SECRET_KEY
    Auth-->>User: Set HTTP-Only Cookie (access_token) & 200 OK
    
    Note over User: Navigate to /admin/dashboard
    User->>Mid: Request page (access_token cookie included)
    Mid->>Mid: Decrypt JWT & check payload.role
    alt Role is Admin
        Mid-->>User: Forward request to /admin/dashboard
    else Role is User / Token invalid
        Mid-->>User: Redirect to /auth/login
    end
```

### B. Secure Checkout & Razorpay Flow
To prevent client-side price tampering, all cart values are verified server-side against MongoDB before generating a transaction.

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant API_Order as /api/payment/get-order-id
    participant Razorpay as Razorpay API
    participant API_Save as /api/payment/save-order
    participant DB as MongoDB
    participant SMTP as Nodemailer

    User->>API_Order: POST cart total details
    Note over API_Order: Validate cart pricing in DB
    API_Order->>Razorpay: Initialize Order (amount, INR currency)
    Razorpay-->>API_Order: Return Razorpay Order ID
    API_Order-->>User: Return Order ID to Client
    
    User->>User: Launch Razorpay Checkout Modal
    User->>User: Authorize Payment
    Razorpay-->>User: Return payment_id, order_id, signature
    
    User->>API_Save: POST payment credentials & checkout address
    API_Save->>API_Save: validatePaymentVerification(signature, secret)
    alt Signature Matches
        API_Save->>DB: Create Order Document (status: 'pending')
        API_Save->>SMTP: Trigger transactional confirmation email
        API_Save-->>User: Return HTTP 200 (Success)
    else Signature Fails
        API_Save-->>User: Return HTTP 400 (Bad Request)
    end
```
