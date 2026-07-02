# Local Environment Setup Guide

This document walks you through the prerequisites and step-by-step setup required to run this Next.js E-Commerce platform locally on your machine.

---

## 1. Prerequisites

Before starting, ensure you have the following installed and configured:

1. **Node.js**: Version 18.0.0 or higher.
2. **MongoDB**: Either a local instance (Community Edition) or a free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
3. **Cloudinary Account**: A free account on [Cloudinary](https://cloudinary.com/) for hosting product and variant images.
4. **Razorpay Account**: A free account on [Razorpay](https://razorpay.com/) (Test mode is sufficient) for credit card/UPI payment processing.
5. **SMTP Provider**: Access to an email server (e.g. Gmail SMTP) with an App Password to dispatch OTP verification codes.

---

## 2. Step-by-Step Installation

### Step 1: Clone the Repository
Clone the repository to your local directory:
```bash
git clone https://github.com/piyushgarg6702-cyber/e-commerce.git
cd e-commerce
```

### Step 2: Install Project Dependencies
Use `npm` to install all package modules:
```bash
npm install
```

### Step 3: Create Local Environment Configuration File
Copy the example environment template to create your active configuration file:
```bash
cp .env.example .env.local
```

### Step 4: Populate Environment Variables
Open the `.env.local` file in your code editor and fill in the values:

```ini
# MongoDB Connection (Atlas Cluster or local database)
MONGODB_URL="mongodb+srv://<username>:<password>@cluster.dobopy.mongodb.net/e-commerce"

# Secure random token used to encrypt access token JWTs in cookies
# You can generate a random string using: openssl rand -base64 32
SECRET_KEY="your_secure_base64_secret_key"

# SMTP Mail Server Credentials (for OTPs and Order Notifications)
NODEMAILER_HOST="smtp.gmail.com"
NODEMAILER_PORT="587"
NODEMAILER_EMAIL="your_email@gmail.com"
NODEMAILER_PASSWORD="your_app_specific_gmail_password" # Not your account password!

# Application Domain Setup
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NODE_ENV="development"

# Cloudinary Storage Accounts (For uploading category/product photos)
NEXT_PUBLIC_CLOUDINARY_API_KEY="your_cloudinary_api_key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_SECRET_KEY="your_cloudinary_secret_key"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="e-commerce" # Must match preset created in Cloudinary dashboard

# Razorpay Checkout API Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

---

## 3. Cloudinary Configuration

To allow admins to upload images, you must configure an **unsigned upload preset** in Cloudinary:
1. Log in to your Cloudinary Console.
2. Go to **Settings** (Gear icon) -> **Upload** tab.
3. Scroll down to **Upload presets** and click **Add upload preset**.
4. Set the **Upload preset name** to match `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (e.g., `e-commerce`).
5. Change **Signing Mode** to **Unsigned**.
6. Save the settings.

---

## 4. Run the Development Server

Start the local server using Next.js Turbopack for optimal page load speed:
```bash
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

---

## 5. Seeding Mock Data

To populate the database catalog with mock users, products, variants, and reviews, you can run the mock data seeder:

1. Ensure you have registered at least one Category in the database or Admin panel (otherwise the products cannot link to a category).
2. Ensure you have registered some media files under the Media Library (since products draw random images from available media uploads).
3. Send an HTTP `POST` request to:
   ```http
   POST http://localhost:3000/api/faker/product
   ```
   You can trigger this using curl:
   ```bash
   curl -X POST http://localhost:3000/api/faker/product
   ```
4. This script will generate:
   * 5 products per Category.
   * 20 variations (4 colors × 5 sizes) per product.
   * Mock inventory levels, prices, SKUs, and random media links.
