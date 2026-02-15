# 🚀 COMPLETE Deployment Guide - Vercel + Supabase
## 100% FREE - No Credit Card Required!

**Total Time: 30 minutes**  
**Total Cost: $0/month**  
**Difficulty: Easy**

---

## 🎯 What We're Using

```
┌─────────────────────────────────────────────┐
│  SUPABASE (Database + Backend)              │
│  ├── PostgreSQL Database (500MB FREE)       │
│  └── Built-in REST API (Automatic!)         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  VERCEL (Frontend + Backend API)            │
│  ├── Main Website (React)                   │
│  ├── Admin Dashboard (React)                │
│  └── Backend API (Serverless Functions)     │
└─────────────────────────────────────────────┘
```

**Why Supabase?**
- ✅ 100% FREE (no credit card)
- ✅ Never sleeps (always on!)
- ✅ 500MB database
- ✅ Built-in authentication
- ✅ Real-time updates
- ✅ Easy to use dashboard

---

# PART 1: CREATE SUPABASE DATABASE

**Time: 8 minutes**

---

## Step 1.1: Create Supabase Account

1. Open browser
2. Go to: **https://supabase.com**
3. Click **"Start your project"** (green button)
4. Click **"Sign in with GitHub"**
5. Click **"Authorize Supabase"**
6. You'll see Supabase Dashboard

✅ **You should see "Welcome to Supabase"**

---

## Step 1.2: Create New Project

1. Click **"New project"** (green button)
2. You'll see "Create a new project" form

Fill it out:

**Name:**
```
AM Fashions
```

**Database Password:**
- Click **"Generate a password"** button
- **COPY THIS PASSWORD** and save it in notepad!
- You'll need it later

**Region:**
- Choose closest to you:
  - **South East Asia (Singapore)** - For Asia
  - **West US (North California)** - For USA West
  - **East US (North Virginia)** - For USA East
  - **Central EU (Frankfurt)** - For Europe

**Pricing Plan:**
- Select **"Free"** (should be selected by default)
- You'll see: "Free - 500 MB database, 50,000 monthly active users"

3. Click **"Create new project"** (green button)

⏳ **Wait 2-3 minutes** - You'll see "Setting up project..."

✅ **When done, you'll see your project dashboard**

---

## Step 1.3: Get Database Connection Details

1. In your project dashboard, look at the left sidebar
2. Click **"Project Settings"** (gear icon at bottom)
3. Click **"Database"** in the left menu
4. Scroll down to **"Connection string"** section

You'll see several connection strings. We need the **"URI"** format.

5. Click on **"URI"** tab
6. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

7. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with the actual password you saved in Step 1.2

8. **COPY THIS FULL URL** and save it in notepad as "DATABASE_URL"

Example:
```
postgresql://postgres:your_actual_password_here@db.abcdefgh.supabase.co:5432/postgres
```

---

## Step 1.4: Get Supabase API Keys

1. Still in Project Settings, click **"API"** in left menu
2. You'll see two important values:

**Project URL:**
```
https://abcdefgh.supabase.co
```
**COPY THIS** - Save as "SUPABASE_URL"

**anon public key:** (long string starting with "eyJ...")
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**COPY THIS** - Save as "SUPABASE_ANON_KEY"

**service_role secret key:** (Click "Reveal" button first)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**COPY THIS** - Save as "SUPABASE_SERVICE_KEY"

⚠️ **Keep these safe!** Don't share them publicly.

---

## Step 1.5: Import Database Schema

1. In left sidebar, click **"SQL Editor"** (icon looks like </> )
2. Click **"New query"** button
3. You'll see a blank SQL editor

4. Open this file on your computer:
   ```
   am-with-emailjs/admin-dashboard/database/postgresql_setup.sql
   ```

5. **Copy ALL contents** of that file (Ctrl+A, Ctrl+C)

6. **Paste** into Supabase SQL Editor (Ctrl+V)

7. Click **"Run"** button (or press Ctrl+Enter)

⏳ **Wait 10-20 seconds**

✅ **You should see:** "Success. No rows returned"

---

## Step 1.6: Verify Tables Created

1. In left sidebar, click **"Table Editor"** (icon looks like a table)
2. You should see a list of tables on the left:
   - admins
   - customers
   - products
   - product_variants
   - orders
   - order_items
   - payments
   - coupons
   - returns
   - payment_verifications
   - payment_verification_logs
   - login_approval_requests

✅ **If you see these tables, you're good!**

---

# PART 2: DEPLOY BACKEND TO VERCEL

**Time: 8 minutes**

We'll deploy the backend as Vercel Serverless Functions.

---

## Step 2.1: Update Backend for Vercel Serverless

The backend is already configured to work with both traditional hosting and Vercel!

Just verify you have these files:
- ✅ `admin-dashboard/server/server.js`
- ✅ `admin-dashboard/server/config/database-postgres.js`
- ✅ `admin-dashboard/server/package.json`

---

## Step 2.2: Create Vercel Account (if you haven't)

1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Click **"Authorize Vercel"**

✅ **You should see Vercel Dashboard**

---

## Step 2.3: Deploy Backend

1. Click **"Add New..."** (top right)
2. Click **"Project"**
3. Find your repository: `am-fashions/am-with-emailjs`
4. Click **"Import"**

### Configure Backend Project:

**Project Name:**
```
am-fashions-backend
```

**Framework Preset:**
- Select **"Other"** (we'll configure manually)

**Root Directory:**
- Click **"Edit"**
- Type: `admin-dashboard/server`
- Click **"Continue"**

**Build Settings:**

**Build Command:**
```
npm install
```

**Output Directory:**
- Leave blank

**Install Command:**
```
npm install
```

---

## Step 2.4: Add Environment Variables

Click **"Environment Variables"** to expand.

Add these variables ONE BY ONE:

### Variable 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Your Supabase connection string from Step 1.3
  ```
  postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
  ```

### Variable 2: SUPABASE_URL
- **Key:** `SUPABASE_URL`
- **Value:** Your Supabase project URL from Step 1.4
  ```
  https://xxxxx.supabase.co
  ```

### Variable 3: SUPABASE_ANON_KEY
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** Your anon public key from Step 1.4

### Variable 4: SUPABASE_SERVICE_KEY
- **Key:** `SUPABASE_SERVICE_KEY`
- **Value:** Your service_role key from Step 1.4

### Variable 5: PORT
- **Key:** `PORT`
- **Value:** `5000`

### Variable 6: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`

### Variable 7: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** Generate a random string

**To generate:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Variable 8: EMAIL_USER
- **Key:** `EMAIL_USER`
- **Value:** `madasumiteesh@gmail.com`

### Variable 9: EMAIL_PASSWORD
- **Key:** `EMAIL_PASSWORD`
- **Value:** `mnfc xdxe ojpi rtzf`

### Variable 10: ADMIN_EMAIL
- **Key:** `ADMIN_EMAIL`
- **Value:** `madasumiteesh@gmail.com`

### Variable 11: FRONTEND_URL
- **Key:** `FRONTEND_URL`
- **Value:** `https://yourdomain.com` (we'll update later)

### Variable 12: ADMIN_URL
- **Key:** `ADMIN_URL`
- **Value:** `https://admin.yourdomain.com` (we'll update later)

---

## Step 2.5: Deploy Backend

1. Click **"Deploy"** button

⏳ **Wait 3-5 minutes**

✅ **When done, you'll see "Congratulations!"**

---

## Step 2.6: Get Backend URL

1. Click **"Continue to Dashboard"**
2. Copy your URL: `https://am-fashions-backend.vercel.app`
3. **SAVE THIS** in notepad

---

## Step 2.7: Test Backend

1. Open: `https://am-fashions-backend.vercel.app/api/health`

✅ **You should see:**
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "Connected"
}
```

**If you see an error:**
- Wait 1 minute and try again
- Check Vercel logs (Functions tab)
- Verify DATABASE_URL is correct

---

# PART 3: DEPLOY MAIN WEBSITE TO VERCEL

**Time: 5 minutes**

---

## Step 3.1: Update Environment Variables

1. Open file: `am-with-emailjs/.env.production`
2. Update with your backend URL:
   ```env
   REACT_APP_API_URL=https://am-fashions-backend.vercel.app/api
   ```
3. **Save**

---

## Step 3.2: Commit and Push

```bash
cd am-with-emailjs
git add .
git commit -m "Update production API URL for Vercel"
git push origin main
```

---

## Step 3.3: Deploy Website

1. Vercel Dashboard → **"Add New..."** → **"Project"**
2. Import: `am-fashions/am-with-emailjs`
3. Click **"Import"**

**Project Name:**
```
am-fashions
```

**Framework Preset:**
```
Create React App
```

**Root Directory:**
- Leave as `./` (default)

**Build Command:**
```
npm run build
```

**Output Directory:**
```
build
```

**Environment Variables:**
- **Key:** `REACT_APP_API_URL`
- **Value:** `https://am-fashions-backend.vercel.app/api`

4. Click **"Deploy"**

⏳ **Wait 3-5 minutes**

✅ **Copy your website URL:** `https://am-fashions.vercel.app`

---

## Step 3.4: Test Website

1. Open your website URL
2. You should see your products!

✅ **Test:**
- Browse products ✅
- Add to cart ✅
- View cart ✅

---

# PART 4: DEPLOY ADMIN DASHBOARD

**Time: 5 minutes**

---

## Step 4.1: Update Admin Environment

1. Open: `am-with-emailjs/admin-dashboard/client/.env.production`
2. Update:
   ```env
   VITE_API_URL=https://am-fashions-backend.vercel.app/api
   ```
3. **Save**

---

## Step 4.2: Commit and Push

```bash
git add .
git commit -m "Update admin API URL"
git push origin main
```

---

## Step 4.3: Deploy Admin

1. Vercel Dashboard → **"Add New..."** → **"Project"**
2. Import: `am-fashions/am-with-emailjs`

**Project Name:**
```
am-fashions-admin
```

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
admin-dashboard/client
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Environment Variables:**
- **Key:** `VITE_API_URL`
- **Value:** `https://am-fashions-backend.vercel.app/api`

3. Click **"Deploy"**

✅ **Copy admin URL:** `https://am-fashions-admin.vercel.app`

---

# PART 5: UPDATE CORS SETTINGS

**Time: 2 minutes**

---

## Step 5.1: Update Backend Environment Variables

1. Go to Vercel Dashboard
2. Click on **"am-fashions-backend"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left menu

---

## Step 5.2: Update URLs

Find and edit these variables:

**FRONTEND_URL:**
- Click **"Edit"**
- Change to: `https://am-fashions.vercel.app`
- Click **"Save"**

**ADMIN_URL:**
- Click **"Edit"**
- Change to: `https://am-fashions-admin.vercel.app`
- Click **"Save"**

---

## Step 5.3: Redeploy Backend

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"..."** (three dots)
4. Click **"Redeploy"**
5. Click **"Redeploy"** to confirm

⏳ **Wait 1-2 minutes**

✅ **Done!**

---

# PART 6: FINAL TESTING

**Time: 5 minutes**

---

## Test 1: Backend

Open: `https://am-fashions-backend.vercel.app/api/health`

✅ **Should see:** `{"status":"OK"}`

---

## Test 2: Place Test Order

1. Go to your website
2. Add a product to cart
3. Go to checkout
4. Fill out form:
   - Name: Test Customer
   - Email: your-email@gmail.com
   - Phone: 1234567890
   - Address: 123 Test St
5. Upload any image as payment screenshot
6. Submit order

✅ **You should:**
- See success message
- Receive email confirmation

---

## Test 3: Admin Login

1. Go to admin dashboard
2. Click "Request Login"
3. Email: `admin@amfashions.com`
4. Password: `admin123`
5. Click "Request Login"
6. Check email (madasumiteesh@gmail.com)
7. Click approval link
8. You should be logged in!

✅ **Check:**
- Can see dashboard ✅
- Can see orders ✅
- Can see payment verifications ✅
- Can see your test order ✅

---

## Test 4: Check Console

1. Open website
2. Press **F12**
3. Click **"Console"** tab

✅ **Should NOT see:**
- ❌ CORS errors
- ❌ Network errors
- ❌ 404 errors

---

# 🎉 CONGRATULATIONS!

## You've Successfully Deployed:

```
✅ Supabase PostgreSQL Database (500MB)
✅ Backend API on Vercel (Serverless)
✅ Main Website on Vercel
✅ Admin Dashboard on Vercel
✅ Email Notifications
✅ Payment Verification
✅ SSL Certificates (Automatic)
✅ Always On (Never sleeps!)
```

---

## 📊 Your Live URLs

```
Main Website:     https://am-fashions.vercel.app
Admin Dashboard:  https://am-fashions-admin.vercel.app
Backend API:      https://am-fashions-backend.vercel.app
Database:         Supabase PostgreSQL (500MB)

Total Cost:       $0/month 🎉
```

---

## 🔄 How to Update

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**All three services auto-deploy!** 🚀

---

## 💡 Supabase Advantages

✅ **Never sleeps** - Always instant response  
✅ **500MB database** - More than Render free tier  
✅ **Built-in dashboard** - Easy to view/edit data  
✅ **Real-time** - Can add live features later  
✅ **Authentication** - Built-in auth system  
✅ **Storage** - Can store files (images, etc.)  
✅ **No credit card** - Truly free forever  

---

## 🔧 Supabase Dashboard Features

### View Your Data:
1. Go to Supabase Dashboard
2. Click **"Table Editor"**
3. Click any table to view/edit data
4. You can see all orders, customers, products!

### Run SQL Queries:
1. Click **"SQL Editor"**
2. Write any SQL query
3. Click **"Run"**

### Monitor Database:
1. Click **"Database"** → **"Roles"**
2. See connection stats
3. Monitor performance

---

## 🆘 Troubleshooting

### "Cannot connect to database"
→ Check DATABASE_URL in Vercel
→ Make sure password is correct (no special characters issues)
→ Verify Supabase project is active

### CORS errors
→ Update FRONTEND_URL and ADMIN_URL in Vercel backend
→ Redeploy backend after changes

### Admin login not working
→ Check email credentials in Vercel
→ Check spam folder for approval email
→ Verify admin user exists in Supabase (Table Editor → admins)

### Vercel build fails
→ Check build logs in Vercel
→ Verify all dependencies in package.json
→ Try redeploying

---

## 📈 Free Tier Limits

### Supabase Free:
- 500 MB database storage
- 50,000 monthly active users
- 2 GB bandwidth
- 1 GB file storage
- Unlimited API requests

### Vercel Free:
- 100 GB bandwidth/month
- Unlimited deployments
- Unlimited projects
- Serverless function executions: 100 GB-hours

**Perfect for starting out!** 🚀

---

## 🎯 Next Steps

### 1. Add Custom Domain (Free):
- Vercel → Settings → Domains
- Add your domain
- Follow DNS instructions

### 2. Enable Vercel Analytics (Free):
- Vercel → Analytics tab
- See visitor stats

### 3. Set Up Database Backups:
- Supabase → Database → Backups
- Free daily backups included!

### 4. Add More Products:
- Supabase → Table Editor → products
- Click "Insert row"
- Add your products

### 5. Monitor Usage:
- Supabase → Settings → Usage
- Vercel → Usage tab
- Stay within free limits

---

## 🌟 Why This Stack is Great

**Supabase:**
- Open source (can self-host later)
- PostgreSQL (most powerful free database)
- Built by developers, for developers
- Amazing documentation
- Active community

**Vercel:**
- Made by Next.js creators
- Best performance (global CDN)
- Instant deployments
- Great developer experience
- Generous free tier

**Together:**
- ✅ 100% free
- ✅ Production-ready
- ✅ Scalable
- ✅ Fast
- ✅ Reliable

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Email**: madasumiteesh@gmail.com

---

## 🎊 You Did It!

You've deployed a professional e-commerce platform with:
- Product catalog
- Shopping cart
- Order management
- Payment verification (screenshot upload)
- Email notifications
- Admin dashboard
- Customer management
- Analytics

**All powered by FREE, production-ready services!** 🚀

This is the same stack used by many successful startups. You're ready to start selling!

**Congratulations!** 🎉🎉🎉

---

## 📝 Quick Reference

### Supabase Dashboard:
- **View Data**: Table Editor
- **Run SQL**: SQL Editor
- **API Keys**: Settings → API
- **Database URL**: Settings → Database

### Vercel Dashboard:
- **View Logs**: Project → Functions
- **Environment Variables**: Project → Settings → Environment Variables
- **Deployments**: Project → Deployments
- **Analytics**: Project → Analytics

### Important URLs:
```
Supabase: https://app.supabase.com
Vercel: https://vercel.com/dashboard
GitHub: https://github.com/am-fashions/am-with-emailjs
```

**Save this guide for future reference!** 📖
