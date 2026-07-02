# Production Deployment Guide

This document describes the steps required to deploy the Next.js E-Commerce platform to production, using **Vercel** for hosting, **MongoDB Atlas** for database storage, and **Cloudinary** for CDN assets.

---

## 1. MongoDB Atlas Production Setup

1. Sign in to your [MongoDB Atlas Console](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (the free shared tier is suitable).
3. Under **Network Access**, add a rule to allow connections from anywhere (`0.0.0.0/0`), as Vercel serverless functions use dynamic IP addresses.
4. Under **Database Access**, create a database user with read and write permissions to the project database.
5. Copy your cluster's **SRV Connection String**:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/production-ecommerce?retryWrites=true&w=majority
   ```

---

## 2. Cloudinary Production Setup

1. Navigate to the Cloudinary Dashboard and log in.
2. Note your Cloud Name, API Key, and API Secret.
3. Set up your upload preset under Settings -> Upload, setting its mode to **Unsigned** so the client browser can upload images directly to your bucket via signed signatures.

---

## 3. Razorpay Live Configuration

1. Log into the Razorpay Dashboard.
2. Navigate to **Settings** -> **API Keys**.
3. Generate live API keys (these will begin with `rzp_live_`).
4. Swap out the development `rzp_test_` keys in your production environment variables.

---

## 4. Vercel Deployment Steps

Vercel is the recommended hosting platform for Next.js applications, offering automatic scaling, edge networking, and zero-configuration serverless functions.

### Step 1: Push Code to GitHub
Ensure all your modified code is committed and pushed to your GitHub repository.

### Step 2: Import Project to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your cloned E-Commerce repository from GitHub.

### Step 3: Configure Environment Variables
Expand the **Environment Variables** section on Vercel and paste your production keys:

| Key | Example Value | Description |
|---|---|---|
| `MONGODB_URL` | `mongodb+srv://...` | MongoDB Atlas SRV connection string |
| `SECRET_KEY` | `M+FSJwSHrnImjtcN1...` | Base64-encoded cryptographically strong JWT secret |
| `NODEMAILER_HOST` | `smtp.gmail.com` | Production SMTP mail host |
| `NODEMAILER_PORT` | `587` | Production SMTP mail port |
| `NODEMAILER_EMAIL` | `prod-alerts@domain.com` | Sender email address |
| `NODEMAILER_PASSWORD` | `xxxx xxxx xxxx xxxx` | App-specific email password |
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.vercel.app` | Production app deployment domain |
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-domain.vercel.app/api` | Production app deployment API URL |
| `NODE_ENV` | `production` | Set to `production` |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | `98273645...` | Cloudinary production API Key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `prod-cloud` | Cloudinary production cloud bucket name |
| `CLOUDINARY_SECRET_KEY` | `_Ab6DtuVzGU...` | Cloudinary production API Secret |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `e-commerce` | Cloudinary unsigned preset name |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_...` | Razorpay Live Key ID |
| `RAZORPAY_KEY_SECRET` | `live_secret_key...` | Razorpay Live Secret Key |

### Step 4: Build & Deploy
1. Click **Deploy**.
2. Vercel will build the Next.js bundle and deploy your application.
3. Once completed, copy the generated Vercel domain link (e.g., `https://e-commerce-piyushgarg.vercel.app`) and update it in your `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_API_BASE_URL` env configs.
