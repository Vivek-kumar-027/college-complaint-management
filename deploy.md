# 🚀 Production Deployment Guide: CampusResolve

This guide provides comprehensive, step-by-step instructions to deploy the **CampusResolve** College Complaint Management System to a live production server.

---

## 📋 Table of Contents
1. [Architecture & Deployment Options](#1-architecture--deployment-options)
2. [Prerequisites & Account Checklist](#2-prerequisites--account-checklist)
3. [Step 1: Set Up Cloud Database (MongoDB Atlas)](#step-1-set-up-cloud-database-mongodb-atlas)
4. [Step 2: Prepare Git & Push to GitHub](#step-2-prepare-git--push-to-github)
5. [Step 3: Deploy Option 1 — Single-Service on Render (Recommended)](#step-3-deploy-option-1--single-service-on-render-recommended)
6. [Step 4: Deploy Option 2 — Split Deployment (Vercel + Render)](#step-4-deploy-option-2--split-deployment-vercel--render)
7. [Step 5: Deploy Option 3 — Self-Hosted Linux VPS (AWS EC2 / DigitalOcean / Ubuntu)](#step-5-deploy-option-3--self-hosted-linux-vps-aws-ec2--digitalocean--ubuntu)
8. [Step 6: Seed Demo Data on Live Database](#step-6-seed-demo-data-on-live-database)
9. [Step 7: Post-Deployment Verification Checklist](#step-7-post-deployment-verification-checklist)
10. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. Architecture & Deployment Options

CampusResolve is a full-stack MERN application:
- **Frontend**: React 18, Vite, Tailwind CSS (Single Page Application)
- **Backend**: Node.js & Express REST API
- **Database**: MongoDB (Mongoose ODM)
- **File Uploads**: Local file storage via Multer in `server/uploads/`

### Which Deployment Method Should You Choose?

| Option | Best For | Pros | Complexity |
|---|---|---|---|
| **Option 1: Render Full-Stack (Recommended)** | Students, Portfolio, Evaluations | • 1 Single URL<br>• No CORS configuration issues<br>• File uploads work seamlessly<br>• Free tier available | ⭐ Easy |
| **Option 2: Vercel (UI) + Render (API)** | Global CDN performance | • Ultra-fast frontend loading on Vercel Edge CDN<br>• Decoupled frontend & backend | ⭐⭐ Moderate |
| **Option 3: Ubuntu VPS (AWS EC2 / DigitalOcean)** | Production / Institutional self-hosting | • Full control over server & disks<br>• No free-tier cold starts<br>• Unlimited storage & custom domain with free SSL | ⭐⭐⭐ Advanced |

---

## 2. Prerequisites & Account Checklist

Before proceeding, sign up for free accounts on:
1. **[GitHub](https://github.com/)** — To host your source code.
2. **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)** — Cloud MongoDB database (Free M0 tier).
3. **[Render](https://render.com/)** — Free cloud hosting for Node.js / Express web services.
4. *(Optional)* **[Vercel](https://vercel.com/)** — If deploying frontend separately.

---

## Step 1: Set Up Cloud Database (MongoDB Atlas)

Since local MongoDB (`mongodb://localhost:27017`) cannot be reached by cloud servers, you must use a cloud database:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Click **"Build a Database"** and select the **M0 Free Cluster** (Shared).
3. Choose a cloud provider (AWS recommended) and region closest to your users (e.g., `ap-south-1` Mumbai).
4. Click **"Create"**.
5. **Security Setup — Database User**:
   - Go to **Security > Database Access** (left sidebar).
   - Click **"Add New Database User"**.
   - Authentication Method: **Password**.
   - Username: `campus_admin` (or your preferred name).
   - Password: Click **"Autogenerate Secure Password"** or enter a strong password (e.g., `CampusSecurePass2026!`).
   - Role: **Read and write to any database**.
   - Click **"Add User"**. *(Save this username and password!)*
6. **Security Setup — Network Access**:
   - Go to **Security > Network Access** (left sidebar).
   - Click **"Add IP Address"**.
   - Click **"Allow Access From Anywhere"** (`0.0.0.0/0`).
   - Click **"Confirm"**. *(Required so Render/Vercel can connect from dynamic cloud IP addresses)*.
7. **Get Your Connection String**:
   - Go to **Deployment > Database**.
   - Click the **"Connect"** button on your Cluster.
   - Choose **"Drivers"** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/college_complaint_db?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the credentials created in Step 5.

---

## Step 2: Prepare Git & Push to GitHub

1. Open your terminal in the project root directory:
   ```bash
   cd E:\NxtWave\Collage_management
   ```

2. Initialize Git (if not already done):
   ```bash
   git init
   ```

3. Confirm that `.gitignore` is present in the root folder (protects `node_modules`, `.env`, and build files).

4. Add and commit all project files:
   ```bash
   git add .
   git commit -m "feat: complete college complaint management system ready for production"
   ```

5. Create a new repository on [GitHub](https://github.com/new) named `college-complaint-management`.

6. Link and push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/college-complaint-management.git
   git push -u origin main
   ```

---

## Step 3: Deploy Option 1 — Single-Service on Render (Recommended)

In this setup, Express serves the built React frontend, API endpoints, and uploads from a single unified server.

### 1. Create a Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **"New +"** and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and select your GitHub repository.

### 2. Configure Service Settings
- **Name**: `campus-resolve` (or any unique name)
- **Region**: Closest to your users (e.g., Singapore / Frankfurt)
- **Branch**: `main`
- **Root Directory**: *(Leave empty / root)*
- **Runtime**: `Node`
- **Build Command**:
  ```bash
  npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```
- **Instance Type**: `Free`

### 3. Add Environment Variables
Scroll down to the **"Environment Variables"** section and add the following:

| Key | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode & static frontend serving |
| `PORT` | `10000` | Port assigned by Render |
| `MONGODB_URI` | `mongodb+srv://campus_admin:<password>@cluster0.abcde.mongodb.net/college_complaint_db?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `campus_resolve_jwt_super_secret_production_key_2026` | Secure random secret string for JWT tokens |
| `CLIENT_URL` | `https://campus-resolve.onrender.com` | Your live Render service URL (copy from top of page) |

### 4. Deploy
1. Click **"Create Web Service"**.
2. Render will automatically run `npm run build` (installing all dependencies and generating Vite production assets in `client/dist/`) and then run `npm start`.
3. Once the logs display:
   ```text
   Server running in production mode on port 10000
   ```
4. Visit your live site URL at: `https://campus-resolve.onrender.com`!

---

## Step 4: Deploy Option 2 — Split Deployment (Vercel + Render)

If you prefer deploying the React frontend on **Vercel** and Express API on **Render**:

### Part A: Deploy Backend API on Render
1. In Render, create a new **Web Service** from your Git repo.
2. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Your JWT Secret>`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
4. Copy the backend service URL (e.g., `https://campus-api.onrender.com`).

### Part B: Deploy Frontend on Vercel
1. Log in to [Vercel](https://vercel.com/) and click **"Add New..." > "Project"**.
2. Import your GitHub repository.
3. In the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL` = `https://campus-api.onrender.com/api`
5. Click **"Deploy"**.
6. Vercel will build the frontend. The included `client/vercel.json` ensures all React Router routes work on refresh.

---

## Step 5: Deploy Option 3 — Self-Hosted Linux VPS (AWS EC2 / DigitalOcean / Ubuntu)

For institutional deployments or high performance on a virtual machine (Ubuntu 22.04 / 24.04 LTS):

### 1. Update Server & Install Node.js 20 LTS
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
```

### 2. Clone and Build Project
```bash
cd /var/www
sudo git clone https://github.com/<YOUR_GITHUB_USERNAME>/college-complaint-management.git
cd college-complaint-management
sudo chown -R $USER:$USER /var/www/college-complaint-management
npm run install:all
npm run build
```

### 3. Create Production `.env`
```bash
nano server/.env
```
Paste:
```ini
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://campus_admin:<password>@cluster0.abcde.mongodb.net/college_complaint_db?retryWrites=true&w=majority
JWT_SECRET=super_strong_production_secret_key_2026
CLIENT_URL=https://your-college-domain.edu
```

### 4. Setup PM2 Process Manager
```bash
sudo npm install -g pm2
pm2 start server/src/server.js --name "campus-resolve"
pm2 save
pm2 startup
# Run the command generated by pm2 startup to enable autostart on reboot
```

### 5. Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/campus-resolve
```
Add:
```nginx
server {
    listen 80;
    server_name your-college-domain.edu;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/campus-resolve /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Install Free SSL with Certbot (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-college-domain.edu
```

---

## Step 6: Seed Demo Data on Live Database

Once your live database is connected, you can seed departments, admin, sample students, and pre-configured complaints:

### Option A: From your local machine (Fastest)
1. Temporarily update your local `server/.env` file:
   ```ini
   MONGODB_URI=mongodb+srv://campus_admin:<password>@cluster0.abcde.mongodb.net/college_complaint_db?retryWrites=true&w=majority
   ```
2. Run the seed command from your local terminal:
   ```bash
   npm run seed
   ```
3. Once completed, your live MongoDB Atlas database will contain all default departments and accounts!
4. Revert your local `server/.env` to `mongodb://localhost:27017/college_complaint_db` for local testing.

### Option B: From Render Shell
1. Go to your Render Web Service dashboard.
2. Click **"Shell"** (tab on the left).
3. Run:
   ```bash
   cd server && node src/seed/seedData.js
   ```

---

## Step 7: Post-Deployment Verification Checklist

Verify that each feature works on the live deployment:

- [ ] **API Health Check**:
  Navigate to `https://your-domain/api/health` and verify you receive `{"status":"ok"}`.
- [ ] **Administrator Login**:
  Sign in with `admin@college.edu` and verify access to the Admin Complaints Registry and Analytics Dashboard.
- [ ] **Student Login**:
  Sign in with `student@college.edu` and verify student dashboard counters (Total, Pending, Resolved).
- [ ] **Submit Complaint**:
  Submit a new issue with a priority, location, and an optional image attachment.
- [ ] **File / Attachment Display**:
  Open the submitted complaint details and confirm the uploaded image or PDF opens correctly.
- [ ] **Workflow Stepper & Status Transition**:
  As Admin, update status from `Submitted` to `Under Review` or `In Progress` and verify the progress bar advances.
- [ ] **Student Rating**:
  Once marked `Resolved`, confirm the student can submit a star rating (1–5) and satisfaction remarks to close the issue.
- [ ] **Direct URL Refresh**:
  Refresh the page on `https://your-domain/complaints/1` and verify it does **not** give a 404 error.

---

## Troubleshooting & FAQ

### 1. `MongooseServerSelectionError: connection timed out`
- **Cause**: MongoDB Atlas has not whitelisted cloud server IP addresses.
- **Fix**: Go to **MongoDB Atlas > Network Access**, ensure `0.0.0.0/0` (Allow Access from Anywhere) is active.

### 2. CORS Error in Browser Console (`Access to fetch blocked by CORS`)
- **Cause**: `CLIENT_URL` in your backend environment variables does not match your frontend domain.
- **Fix**: Make sure `CLIENT_URL` does not include a trailing slash (e.g., `https://campus-resolve.onrender.com` without `/` at the end).

### 3. File Uploads Reset or Missing after a while on Free Render
- **Cause**: Free cloud instances (Render / Heroku) use ephemeral file systems that reset when the instance goes to sleep or restarts.
- **Fix**:
  - For long-term production, attach a **Render Persistent Disk** to `/var/data` and point uploads there.
  - Or use a cloud storage provider like **Cloudinary** or **AWS S3**.
  - On a VPS (Option 3), uploads are permanent on the server disk.

### 4. Slow Response on First Request (Render Free Tier)
- **Cause**: Render free tier puts services to sleep after 15 minutes of inactivity (takes 30–50 seconds to spin up on the first request).
- **Tip**: This is normal on free tiers. Subsequent requests are fast. You can use a free uptime monitor (like [UptimeRobot](https://uptimerobot.com/)) to ping `/api/health` every 10 minutes to keep the service awake.
