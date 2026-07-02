# E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.0-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Gateway-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A production-grade, highly performant full-stack e-commerce platform built with Next.js (App Router), MongoDB, and Razorpay. It features a complete customer storefront and a feature-rich Admin Panel with variant-level inventory controls, soft-delete recovery system, automated OTP email verifications, and interactive dashboards.

---

## 🔗 Live Demo & Credentials

* **Live Demo URL**: [https://e-commerce-gilt-seven-85.vercel.app/](https://e-commerce-gilt-seven-85.vercel.app/)

### Demo Account Credentials
To explore the application features without registering a new account, you may use these credentials:

| Account Type | Email Address | Password |
|---|---|---|
| **Admin Account** | `admin@example.com` | `AdminSecure123` |
| **Customer Account** | `customer@example.com` | `CustomerSecure123` |

---

## 🚀 Key Features

### 🛍️ Customer Features
* **User Authentication**: Secure signup and login flow featuring custom JWT cookies (`access_token`) and email verification using 6-digit OTP codes.
* **Product Catalog**: High-performance display of products grouped by dynamic categories.
* **Fuzzy Product Search**: Real-time product search indexing using Fuse.js.
* **Filter & Sort Grids**: Sift catalog products by price range, category, color, size, and sort order.
* **Shopping Cart**: Client-side state persistence handled by Redux Persist, complete with server-side pricing and stock validation.
* **Promotional Coupons**: Apply active discount codes at checkout to reduce final totals.
* **Secure Checkout**: Integrated payment modal powered by Razorpay (supporting Cards, UPI, Netbanking).
* **Order History & Details**: Track past transactions, invoices, and status metrics in real time.
* **Responsive Layout**: Fluid design optimized for mobile, tablet, and desktop viewports.

### 🛡️ Administrative Features
* **Sales Analytics Dashboard**: Aggregated charts (built with Recharts) displaying daily/weekly revenue statistics, average order value (AOV), and customer volumes.
* **Product Catalog CRUD**: Complete control over creating, editing, and listing products.
* **Variant Matrix Creator**: Add custom colors and sizes per product, each holding distinct pricing, SKUs, inventory counts, and image sheets.
* **Category Manager**: Add or edit product catalog categories.
* **Coupon Manager**: Configure coupon codes, discount percentages, minimum cart requirements, and expiry schedules.
* **Customer List**: Query and review details of registered users.
* **Order Tracker**: Track payments and update shipping statuses (`pending`, `shipped`, `delivered`, `cancelled`).
* **Media Storage Hub**: Browse and delete Cloudinary uploads from a centralized dashboard table.
* **Product Review Moderation**: Moderate customer product reviews and ratings.
* **Soft-Deleted Trash Bin**: A safety net for categories, coupons, products, variants, and reviews. Allows administrators to either restore deleted items or permanently purge them.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Version | Description |
|---|---|---|---|
| **Core Framework** | Next.js (App Router) | `16.2.x` | Server-Side Rendering (SSR) & API Route Handlers |
| **UI Library** | React & ReactDOM | `19.1.x` | Modern UI rendering |
| **Database** | MongoDB | Atlas | Document-based production cluster |
| **ODM Interface** | Mongoose | `8.19.x` | Connection caching and typed schema maps |
| **Styling** | Tailwind CSS & PostCSS | `v4` | Modern CSS styling |
| **Components** | Material UI (MUI) & Radix | `7.x`/`1.x` | Tables, calendars, accordions, and dialog boxes |
| **State Management** | Redux Toolkit | `2.9.x` | Shared state, persistent cart with Redux Persist |
| **Data Fetching** | React Query & Axios | `5.x`/`1.x` | Server state fetching, query caching, and updates |
| **Auth Cryptography** | Jose & BcryptJS | `6.x`/`3.x` | Stateless JWT tokens and secure password hashing |
| **Email Service** | Nodemailer | `7.x` | SMTP dispatch for OTP verification and order alerts |
| **Fuzzy Search** | Fuse.js | `7.x` | Client-side keyword search indexing |

For a deep-dive walkthrough of architectural components and database relations, see:
* 📄 [Architecture Specification](docs/ARCHITECTURE.md)
* 📄 [Database Schema & Entity Maps](docs/DATABASE.md)
* 📄 [Security Controls Guide](docs/SECURITY.md)

---

## 📂 Project Directory Structure

```text
├── app/                  # Next.js App Router root
│   ├── (root)/           # Shared layout route groups
│   │   ├── (admin)/      # Admin panel pages (/admin/*)
│   │   ├── (website)/    # Customer storefront (/shop, /cart, /orders, /profile)
│   │   └── auth/         # Authentication flows (/auth/login, /auth/register, OTP)
│   ├── api/              # Backend REST API endpoints
│   ├── globals.css       # Root stylesheet
│   └── layout.jsx        # Root HTML wrapper
├── components/           # Reusable React components
├── email/                # Nodemailer JSX transactional templates
├── hooks/                # Custom React hooks (React Query calls)
├── lib/                  # Helper utilities (db connection, validation schemas, toast alerts)
├── models/               # MongoDB Mongoose database schemas
├── public/               # Static assets & favicon files
├── screenshots/          # Repository visual documentation captures
├── store/                # Redux Toolkit store config & slices
├── .env.example          # Template configuration file
├── .gitignore            # Version control exclusions
├── LICENSE               # Open-source MIT license parameters
├── middleware.js         # Next.js custom JWT role-based router security
├── package.json          # Package manifest & scripts
└── README.md             # Repository documentation (this file)
```

---

## 🔧 Installation & Local Setup

Get the application running locally in under 5 minutes:

### 1. Clone the Project
```bash
git clone https://github.com/piyushgarg6702-cyber/e-commerce.git
cd e-commerce
```

### 2. Install Package Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Duplicate the template file and fill in your custom keys:
```bash
cp .env.example .env.local
```
Refer to the [Environment Variables Guide](#-environment-variables) below for variable details.

### 4. Run Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your local deployment.

For detailed seeding and setup tips, check the 📄 [Setup & Seeding Documentation](docs/SETUP.md).

---

## 🔑 Environment Variables

The application requires the following environment variables. See [`.env.example`](.env.example) for a pre-formatted template.

* `MONGODB_URL`: MongoDB connection string.
* `SECRET_KEY`: Cryptographically strong secret key used by `jose` to sign session cookies.
* `NODEMAILER_HOST` / `NODEMAILER_PORT`: SMTP server coordinates.
* `NODEMAILER_EMAIL` / `NODEMAILER_PASSWORD`: Sender email address and app password.
* `NEXT_PUBLIC_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL`: Base domain coordinates.
* `NEXT_PUBLIC_CLOUDINARY_API_KEY` / `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_SECRET_KEY`: API details for media storage.
* `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Unsigned upload preset created in Cloudinary.
* `NEXT_PUBLIC_RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`: API credentials for payments.

---

## ⚡ API Overview

All REST API endpoints are grouped under `/api/*` and use JSON request/response bodies:

| Area | Endpoint | Method | Guard | Description |
|---|---|---|---|---|
| **Auth** | `/api/auth/register` | `POST` | Public | Registers a user and sends OTP |
| **Auth** | `/api/auth/verifyotp` | `POST` | Public | Validates signup email OTP |
| **Auth** | `/api/auth/login` | `POST` | Public | Authenticates credentials and sets session cookie |
| **Catalog** | `/api/shop` | `GET` | Public | Lists, sorts, and filters products |
| **Catalog** | `/api/product` | `GET` | Public | Fetches detailed product properties |
| **Cart** | `/api/cart-verification` | `POST` | User | Server-side validation of cart prices/stock |
| **Payment** | `/api/payment/get-order-id` | `POST` | User | Generates Razorpay transaction ID |
| **Payment** | `/api/payment/save-order` | `POST` | User | Cryptographic signature verification and order creation |
| **Admin** | `/api/product` | `POST`/`PUT`/`DELETE` | Admin | Product catalog CRUD (soft-delete) |
| **Admin** | `/api/coupon` | `POST`/`PUT`/`DELETE` | Admin | Coupon configuration CRUD |
| **Admin** | `/api/dashboard` | `GET` | Admin | Fetch sales statistics and chart coordinates |

For detailed payloads and request parameters, see the 📄 [API Guide](docs/API.md).

---

## 📊 Database Entities

This application uses MongoDB via Mongoose. For a visual Entity Relationship diagram, refer to 📄 [Database Schemas](docs/DATABASE.md).

* **User**: Profiles, authentication status, and customer/admin roles.
* **Product**: Common catalog details, category references, descriptions.
* **ProductVariant**: Specific combinations of color and size, unique SKUs, pricing, stock levels, and linked media assets.
* **Category**: Product categories.
* **Coupon**: Discount percentages, expiration validity, and minimum purchase requirements.
* **Review**: Product reviews and star ratings.
* **Media**: Metadata for uploaded assets on Cloudinary.
* **Order**: Customer shipping details, shipping statuses, item breakdowns, pricing tallies, and payment signatures.
* **OTP**: Temporary verification codes with MongoDB TTL auto-expirations.

---

## 🛡️ Security Highlights

* **HTTP-Only Cookies**: JWT tokens are transmitted via cookies configured as `HttpOnly`, `Secure`, and `SameSite=Strict`, defending the platform against XSS and CSRF token thefts.
* **Bcrypt Password Hashing**: Hashing algorithm executed pre-save via Mongoose triggers to protect user passphrases.
* **NoSQL Injection Shield**: Strict validation checks utilizing Zod schema models (`lib/zodschema.js`) enforce validation before database operations.
* **Cryptographic Payments Validation**: Secure transaction authentication via HMAC SHA256 checksum checks matching Razorpay signatures.

For a detailed breakdown of security features, see 📄 [Security Policy](docs/SECURITY.md).

---

## 📸 Screenshots

Here are visual previews of the storefront and checkout screens:

### Storefront Interface

| Home / Landing Page | About Us Page |
|---|---|
| ![Home Page](screenshots/home.png) | ![About Us Page](screenshots/about.png) |

| Shop Catalog | Product Details |
|---|---|
| ![Shop Catalog](screenshots/shop.png) | ![Product Details](screenshots/product-details.png) |

| Filtered Shop Catalog | Shopping Cart |
|---|---|
| ![Filtered Shop](screenshots/shop-filtered.png) | ![Shopping Cart](screenshots/cart.png) |

| Secure Checkout Page | Order Details & Success |
|---|---|
| ![Checkout Page](screenshots/checkout.png) | ![Order Details](screenshots/order-details.png) |

| User Account Login |
|---|
| ![Login Page](screenshots/login.png) |

---

## 🔮 Future Enhancements

* **AI Product Recommendations**: Suggest catalog items based on customer navigation history.
* **Multi-Vendor Support**: Enable multiple sellers to register store accounts and list items.
* **Automatic PDF Invoice Generator**: Attach and email printable PDF receipt details on order confirmations.
* **Inventory Predictive Forecasting**: Alert administrators when variant stock levels fall below thresholds.
* **SMS Gateway Integration**: Text order tracking link alerts directly to customer mobile numbers.

---

## 🤝 Contributing

Contributions to improve this portfolio project are welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
