# 🚀 AM FASHIONS - COMPLETE DEPLOYMENT CHECKLIST

## ✅ WHAT YOU'LL DEPLOY

```
1. Supabase Database (PostgreSQL) - FREE
2. Backend API (Vercel) - FREE  
3. Admin Dashboard (Vercel) - FREE
4. Main Website (Vercel + Your Domain) - FREE
```

**Total Time:** 45 minutes  
**Total Cost:** $0/month (except your domain)

---

## 📋 PART 1: SETUP SUPABASE DATABASE (10 minutes)

### Step 1.1: Create Supabase Account

1. Open browser and go to: **https://supabase.com**
2. Click **"Start your project"** (green button)
3. Click **"Sign in with GitHub"**
4. Authorize Supabase
5. You'll see the Supabase Dashboard

✅ **Checkpoint:** You should see "Welcome to Supabase"

---

### Step 1.2: Create New Project

1. Click **"New project"** (green button)
2. Fill out the form:

   **Organization:** Select or create one
   
   **Name:** `AM Fashions`
   
   **Database Password:** 
   - Click **"Generate a password"** button
   - **⚠️ COPY THIS PASSWORD** - Save it in Notepad!
   - Example: `xK9mP2nQ7vL4wR8t`
   
   **Region:** Choose closest to your customers:
   - `South East Asia (Singapore)` - For India/Asia
   - `West US (North California)` - For USA West
   - `East US (North Virginia)` - For USA East
   - `Central EU (Frankfurt)` - For Europe
   
   **Pricing Plan:** `Free` (should be selected by default)

3. Click **"Create new project"** (green button)

⏳ **Wait 2-3 minutes** - You'll see "Setting up project..."

✅ **Checkpoint:** When done, you'll see your project dashboard with a green "Active" status

---

### Step 1.3: Get Database Connection String

1. In the left sidebar, click **"Project Settings"** (gear icon ⚙️ at bottom)
2. Click **"Database"** in the left menu
3. Scroll down to **"Connection string"** section
4. Click the **"URI"** tab
5. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

6. **IMPORTANT:** Click the **"Copy"** button or manually copy it
7. Replace `[YOUR-PASSWORD]` with the actual password from Step 1.2

**Example:**
```
postgresql://postgres:xK9mP2nQ7vL4wR8t@db.abcdefgh.supabase.co:5432/postgres
```

8. **Save this in Notepad** as "DATABASE_URL"

✅ **Checkpoint:** Your connection string should start with `postgresql://postgres:` and contain your actual password

---

### Step 1.4: Get Supabase API Keys

1. Still in Project Settings, click **"API"** in the left menu
2. You'll see several important values:

**A. Project URL:**
```
https://abcdefgh.supabase.co
```
- **Copy this** → Save as "SUPABASE_URL"

**B. Project API keys:**

Find **"anon public"** key (long string starting with "eyJ..."):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
- **Copy this** → Save as "SUPABASE_ANON_KEY"

Find **"service_role"** key (click "Reveal" button first):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
- **Copy this** → Save as "SUPABASE_SERVICE_KEY"

⚠️ **Keep these safe!** Don't share them publicly.

✅ **Checkpoint:** You should have 4 values saved:
- DATABASE_URL
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY

---

### Step 1.5: Import Database Schema

1. In the left sidebar, click **"SQL Editor"** (icon looks like </> )
2. Click **"New query"** button (top right)
3. You'll see a blank SQL editor

4. **On your computer**, open this file:
   ```
   am_fashiona/admin-dashboard/database/postgresql_setup.sql
   ```

5. **Copy ALL contents** of that file (Ctrl+A, then Ctrl+C)
6. **Paste** into the Supabase SQL Editor (Ctrl+V)
7. Click **"Run"** button (bottom right) or press Ctrl+Enter

⏳ **Wait 10-20 seconds**

✅ **Checkpoint:** You should see "Success. No rows returned" at the bottom

---

### Step 1.6: Verify Tables Were Created

1. In the left sidebar, click **"Table Editor"** (icon looks like a table 📊)
2. You should see a list of tables on the left:
   - ✅ admins
   - ✅ customers
   - ✅ products
   - ✅ product_variants
   - ✅ orders
   - ✅ order_items
   - ✅ payments
   - ✅ coupons
   - ✅ returns
   - ✅ payment_verifications
   - ✅ payment_verification_logs
   - ✅ login_approval_requests

3. Click on **"admins"** table
4. You should see one row with email: `admin@amfashions.com`

✅ **Checkpoint:** All 12 tables are visible and admins table has data

---

## 📋 PART 2: DEPLOY BACKEND API TO VERCEL (10 minutes)

### Step 2.1: Create Vercel Account

1. Go to: **https://vercel.com**
2. Click **"Sign Up"** (top right)
3. Click **"Continue with GitHub"**
4. Click **"Authorize Vercel"**
5. You'll see the Vercel Dashboard

✅ **Checkpoint:** You should see "Let's build something new"

---

### Step 2.2: Push Your Code to GitHub (if not already)

**If your code is NOT on GitHub yet:**

1. Go to **https://github.com**
2. Click **"+"** (top right) → **"New repository"**
3. Name: `am-fashions`
4. Keep it **Private**
5. Click **"Create repository"**

6. **On your computer**, open Command Prompt in your project folder:
   ```bash
   cd C:\Users\chara\OneDrive\Documents\am_fashions\am_fashiona
   ```

7. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/am-fashions.git
   git push -u origin main
   ```

✅ **Checkpoint:** Your code is now on GitHub

---

### Step 2.3: Deploy Backend to Vercel

1. In Vercel Dashboard, click **"Add New..."** (top right)
2. Click **"Project"**
3. Click **"Import Git Repository"**
4. Find your repository: `am-fashions` (or whatever you named it)
5. Click **"Import"**

**Now configure the backend:**

**Project Name:**
```
am-fashions-backend
```

**Framework Preset:**
- Select **"Other"**

**Root Directory:**
- Click **"Edit"** button
- Type: `admin-dashboard/server`
- Click **"Continue"**

**Build Settings:**
- Build Command: `npm install`
- Output Directory: (leave blank)
- Install Command: `npm install`

✅ **Checkpoint:** Root directory shows `admin-dashboard/server`

---

### Step 2.4: Add Backend Environment Variables

**IMPORTANT:** Don't click "Deploy" yet!

1. Scroll down to **"Environment Variables"** section
2. Click to expand it

**Add these variables ONE BY ONE:**

#### Variable 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Paste your Supabase connection string from Step 1.3
  ```
  postgresql://postgres:xK9mP2nQ7vL4wR8t@db.abcdefgh.supabase.co:5432/postgres
  ```
- Click **"Add"**

#### Variable 2: SUPABASE_URL
- **Key:** `SUPABASE_URL`
- **Value:** Your Supabase project URL from Step 1.4
  ```
  https://abcdefgh.supabase.co
  ```
- Click **"Add"**

#### Variable 3: SUPABASE_ANON_KEY
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** Your anon public key from Step 1.4
- Click **"Add"**

#### Variable 4: SUPABASE_SERVICE_KEY
- **Key:** `SUPABASE_SERVICE_KEY`
- **Value:** Your service_role key from Step 1.4
- Click **"Add"**

#### Variable 5: PORT
- **Key:** `PORT`
- **Value:** `5000`
- Click **"Add"**

#### Variable 6: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click **"Add"**

#### Variable 7: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** Generate a random string (any random text, 32+ characters)
  ```
  am-fashions-super-secret-jwt-key-2026-production
  ```
- Click **"Add"**

#### Variable 8: EMAIL_USER
- **Key:** `EMAIL_USER`
- **Value:** `madasumiteesh@gmail.com`
- Click **"Add"**

#### Variable 9: EMAIL_PASSWORD
- **Key:** `EMAIL_PASSWORD`
- **Value:** `mnfc xdxe ojpi rtzf`
- Click **"Add"**

#### Variable 10: ADMIN_EMAIL
- **Key:** `ADMIN_EMAIL`
- **Value:** `madasumiteesh@gmail.com`
- Click **"Add"**

#### Variable 11: FRONTEND_URL
- **Key:** `FRONTEND_URL`
- **Value:** `https://yourdomain.com` (we'll update this later)
- Click **"Add"**

#### Variable 12: ADMIN_URL
- **Key:** `ADMIN_URL`
- **Value:** `https://admin-temp.vercel.app` (we'll update this later)
- Click **"Add"**

✅ **Checkpoint:** You should have 12 environment variables added

---

### Step 2.5: Deploy Backend

1. Click **"Deploy"** button (blue button at bottom)

⏳ **Wait 3-5 minutes** - You'll see build logs

✅ **Checkpoint:** You should see "Congratulations! 🎉"

---

### Step 2.6: Get Backend URL

1. Click **"Continue to Dashboard"**
2. At the top, you'll see your backend URL:
   ```
   https://am-fashions-backend.vercel.app
   ```
3. **COPY THIS URL** - Save it in Notepad as "BACKEND_URL"

✅ **Checkpoint:** Your backend URL is saved

---

### Step 2.7: Test Backend

1. Open a new browser tab
2. Go to: `https://am-fashions-backend.vercel.app/api/health`

✅ **You should see:**
```json
{
  "status": "OK",
  "timestamp": "2026-02-11T...",
  "database": "Connected"
}
```

**If you see an error:**
- Wait 1 minute and refresh
- Check Vercel logs: Dashboard → Functions tab
- Verify DATABASE_URL is correct

---

## 📋 PART 3: DEPLOY ADMIN DASHBOARD (8 minutes)

### Step 3.1: Update Admin Environment File

1. **On your computer**, open this file:
   ```
   am_fashiona/admin-dashboard/client/.env.production
   ```

2. Update it with your backend URL:
   ```env
   VITE_API_URL=https://am-fashions-backend.vercel.app/api
   ```

3. **Save the file**

---

### Step 3.2: Commit and Push Changes

Open Command Prompt in your project folder:

```bash
cd C:\Users\chara\OneDrive\Documents\am_fashions\am_fashiona
git add .
git commit -m "Update admin API URL for production"
git push origin main
```

✅ **Checkpoint:** Changes pushed to GitHub

---

### Step 3.3: Deploy Admin Dashboard

1. Go back to Vercel Dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your **same repository**: `am-fashions`
4. Click **"Import"**

**Configure Admin Dashboard:**

**Project Name:**
```
am-fashions-admin
```

**Framework Preset:**
- Select **"Vite"**

**Root Directory:**
- Click **"Edit"**
- Type: `admin-dashboard/client`
- Click **"Continue"**

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables:**
- **Key:** `VITE_API_URL`
- **Value:** `https://am-fashions-backend.vercel.app/api`
- Click **"Add"**

5. Click **"Deploy"**

⏳ **Wait 3-5 minutes**

✅ **Checkpoint:** Deployment successful

---

### Step 3.4: Get Admin Dashboard URL

1. Click **"Continue to Dashboard"**
2. Copy your admin URL:
   ```
   https://am-fashions-admin.vercel.app
   ```
3. **Save this** in Notepad as "ADMIN_URL"

---

### Step 3.5: Test Admin Dashboard

1. Open: `https://am-fashions-admin.vercel.app`
2. You should see the admin login page
3. Try requesting login:
   - Email: `admin@amfashions.com`
   - Password: `admin123`
   - Click "Request Login"

4. Check email (madasumiteesh@gmail.com) for approval link

✅ **Checkpoint:** Admin dashboard loads and can request login

---

## 📋 PART 4: DEPLOY MAIN WEBSITE WITH YOUR DOMAIN (12 minutes)

### Step 4.1: Update Website Environment File

1. **On your computer**, open:
   ```
   am_fashiona/.env.production
   ```

2. Update with your backend URL:
   ```env
   REACT_APP_API_URL=https://am-fashions-backend.vercel.app/api
   ```

3. **Save the file**

---

### Step 4.2: Commit and Push

```bash
cd C:\Users\chara\OneDrive\Documents\am_fashions\am_fashiona
git add .
git commit -m "Update website API URL for production"
git push origin main
```

---

### Step 4.3: Deploy Main Website

1. Vercel Dashboard → **"Add New..."** → **"Project"**
2. Import your **same repository**: `am-fashions`
3. Click **"Import"**

**Configure Main Website:**

**Project Name:**
```
am-fashions-website
```

**Framework Preset:**
- Select **"Create React App"**

**Root Directory:**
- Leave as **"./"** (root) or leave blank

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

**Environment Variables:**
- **Key:** `REACT_APP_API_URL`
- **Value:** `https://am-fashions-backend.vercel.app/api`
- Click **"Add"**

4. Click **"Deploy"**

⏳ **Wait 3-5 minutes**

✅ **Checkpoint:** Deployment successful

---

### Step 4.4: Get Temporary Website URL

1. Copy the Vercel URL:
   ```
   https://am-fashions-website.vercel.app
   ```
2. **Save this** - we'll replace it with your domain next

---

### Step 4.5: Add Your Custom Domain

**Now let's connect your domain!**

1. In the website project dashboard, click **"Settings"** tab
2. Click **"Domains"** in the left menu
3. Click **"Add"** button

4. Enter your domain:
   ```
   yourdomain.com
   ```
   (Replace with your actual domain)

5. Click **"Add"**

6. Vercel will show you DNS records to add

---

### Step 4.6: Configure DNS (At Your Domain Registrar)

**Go to your domain registrar** (where you bought your domain: GoDaddy, Namecheap, etc.)

**Add these DNS records:**

**For Root Domain (yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`
- TTL: `3600`

**For WWW (www.yourdomain.com):**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `3600`

**Save the DNS records**

⏳ **Wait 10-60 minutes** for DNS propagation

✅ **Checkpoint:** DNS records added at your registrar

---

### Step 4.7: Verify Domain

1. Back in Vercel, wait for the domain to verify
2. You'll see a green checkmark when ready
3. Vercel automatically provisions SSL certificate

✅ **Your website is now live at your domain!**

---

## 📋 PART 5: UPDATE BACKEND URLS (5 minutes)

Now that everything is deployed, update the backend with correct URLs.

### Step 5.1: Update Backend Environment Variables

1. Go to Vercel Dashboard
2. Click on **"am-fashions-backend"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left menu

**Update these variables:**

**FRONTEND_URL:**
- Find the variable
- Click **"Edit"**
- Change to: `https://yourdomain.com` (your actual domain)
- Click **"Save"**

**ADMIN_URL:**
- Find the variable
- Click **"Edit"**
- Change to: `https://am-fashions-admin.vercel.app`
- Click **"Save"**

---

### Step 5.2: Redeploy Backend

1. Go to **"Deployments"** tab
2. Click on the latest deployment (top one)
3. Click **"..."** (three dots menu)
4. Click **"Redeploy"**
5. Click **"Redeploy"** to confirm

⏳ **Wait 1-2 minutes**

✅ **Checkpoint:** Backend redeployed with correct URLs

---

## 📋 PART 6: FINAL TESTING (5 minutes)

### Test 1: Backend Health Check

Open: `https://am-fashions-backend.vercel.app/api/health`

✅ **Should see:** `{"status":"OK","database":"Connected"}`

---

### Test 2: Main Website

1. Go to: `https://yourdomain.com`
2. You should see your products
3. Try adding a product to cart
4. Go to checkout

✅ **Should work:** Products load, cart works, checkout form appears

---

### Test 3: Place Test Order

1. Fill out checkout form:
   - Name: Test Customer
   - Email: your-email@gmail.com
   - Phone: 1234567890
   - Address: 123 Test Street
   - City: Test City
   - State: Test State
   - Pincode: 123456

2. Upload any image as payment screenshot
3. Click "Place Order"

✅ **Should see:** Success message and receive email confirmation

---

### Test 4: Admin Dashboard

1. Go to: `https://am-fashions-admin.vercel.app`
2. Request login:
   - Email: `admin@amfashions.com`
   - Password: `admin123`
3. Check email for approval link
4. Click approval link
5. You should be logged in

✅ **Should see:** Dashboard with your test order

---

### Test 5: Check Browser Console

1. On your website, press **F12**
2. Click **"Console"** tab

✅ **Should NOT see:**
- ❌ CORS errors
- ❌ Network errors
- ❌ 404 errors

---

## 🎉 CONGRATULATIONS!

### You've Successfully Deployed:

```
✅ Supabase PostgreSQL Database (500MB FREE)
✅ Backend API on Vercel (Serverless)
✅ Admin Dashboard on Vercel
✅ Main Website on Vercel + Your Domain
✅ Email Notifications Working
✅ Payment Verification System
✅ SSL Certificates (Automatic)
✅ Always On (Never sleeps!)
```

---

## 📊 Your Live URLs

```
Main Website:     https://yourdomain.com
Admin Dashboard:  https://am-fashions-admin.vercel.app
Backend API:      https://am-fashions-backend.vercel.app
Database:         Supabase PostgreSQL (500MB)

Total Cost:       $0/month (except domain) 🎉
```

---

## 🔄 How to Update Your Site

Whenever you make changes to your code:

```bash
cd C:\Users\chara\OneDrive\Documents\am_fashions\am_fashiona
git add .
git commit -m "Your changes description"
git push origin main
```

**All three services auto-deploy!** 🚀

---

## 🆘 Troubleshooting

### "Cannot connect to database"
→ Check DATABASE_URL in Vercel backend settings  
→ Verify password has no special characters causing issues  
→ Test connection in Supabase dashboard

### CORS errors in browser
→ Update FRONTEND_URL and ADMIN_URL in backend  
→ Redeploy backend after changes  
→ Clear browser cache

### Admin login not working
→ Check email credentials in backend environment variables  
→ Check spam folder for approval email  
→ Verify admin user exists in Supabase (Table Editor → admins)

### Website not loading
→ Check if DNS has propagated (use https://dnschecker.org)  
→ Verify domain is added in Vercel  
→ Check build logs in Vercel

### Products not showing
→ Check browser console for errors  
→ Verify REACT_APP_API_URL is correct  
→ Test backend health endpoint

---

## 📞 Support

- **Email:** madasumiteesh@gmail.com
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## 🎯 Next Steps

1. **Add More Products:**
   - Go to Supabase → Table Editor → products
   - Click "Insert row"
   - Add your products

2. **Customize Design:**
   - Edit files in `src/` folder
   - Push to GitHub
   - Auto-deploys!

3. **Monitor Usage:**
   - Supabase → Settings → Usage
   - Vercel → Analytics tab

4. **Set Up Backups:**
   - Supabase → Database → Backups
   - Free daily backups included!

---

**You're ready to start selling!** 🚀

This is a production-ready e-commerce platform with:
- Product catalog
- Shopping cart
- Order management
- Payment verification
- Email notifications
- Admin dashboard
- Customer management

**All powered by FREE, production-ready services!**

**Congratulations!** 🎉🎉🎉
