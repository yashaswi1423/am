# 🚀 COMPLETE Step-by-Step Deployment Guide
## 100% FREE - Render PostgreSQL + Vercel

**Total Time: 35 minutes**  
**Total Cost: $0/month**  
**No Credit Card Required**

---

## 📋 What You'll Need

- [x] GitHub account (you have this)
- [x] Your code pushed to GitHub (done)
- [ ] 35 minutes of uninterrupted time
- [ ] A notepad to write down URLs

---

## 🎯 What We're Deploying

```
┌─────────────────────────────────────────────┐
│  RENDER (Backend + Database)                │
│  ├── PostgreSQL Database (1GB FREE)         │
│  └── Node.js API (750 hours/month FREE)     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  VERCEL (Frontend)                          │
│  ├── Main Website (React)                   │
│  └── Admin Dashboard (React)                │
└─────────────────────────────────────────────┘
```

---

# PART 1: CREATE RENDER POSTGRESQL DATABASE

**Time: 8 minutes**

---

## Step 1.1: Create Render Account

1. Open your browser
2. Go to: **https://render.com**
3. Click the **"Get Started for Free"** button (top right)
4. Click **"Sign in with GitHub"**
5. Click **"Authorize Render"** (green button)
6. You'll be redirected to Render Dashboard

✅ **You should now see the Render Dashboard**

---

## Step 1.2: Create PostgreSQL Database

1. In Render Dashboard, look at the top
2. Click the **"New +"** button (blue button, top right)
3. From the dropdown menu, click **"PostgreSQL"**

You'll see a form. Fill it out exactly like this:

### Database Configuration:

**Name:**
```
am-fashions-db
```
(This is just a label, can be anything)

**Database:**
```
amfashions
```
(This is the actual database name)

**User:**
```
amfashions
```
(This is the database username)

**Region:**
- Choose the one closest to you
- For USA: **Oregon (US West)**
- For Europe: **Frankfurt (EU Central)**
- For Asia: **Singapore (Southeast Asia)**

**PostgreSQL Version:**
```
16
```
(Select the latest version, should be default)

**Datadog API Key:**
- Leave this **EMPTY**

**Instance Type:**
- Select **"Free"**
- You'll see: "Free - 1 GB Storage, Expires after 90 days of inactivity"

4. Click **"Create Database"** (blue button at bottom)

⏳ **Wait 2-3 minutes** - You'll see "Creating..." status

✅ **When done, you'll see "Available" in green**

---

## Step 1.3: Get Database Connection String

1. You should now be on your database page
2. Scroll down to the **"Connections"** section
3. You'll see several connection strings

**IMPORTANT:** We need the **"Internal Database URL"**

4. Find the row that says **"Internal Database URL"**
5. Click the **"Copy"** button (📋 icon) next to it

The URL looks like this:
```
postgres://amfashions:LONG_PASSWORD_HERE@dpg-xxxxx-a.oregon-postgres.render.com/amfashions
```

6. **PASTE THIS IN A NOTEPAD** - You'll need it multiple times!

---

## Step 1.4: Import Database Schema

Now we need to create all the tables in your database.

### Option A: Using Render's Web Shell (EASIEST)

1. On your database page, look at the tabs at the top
2. Click the **"Shell"** tab
3. You'll see a terminal-like interface
4. It will automatically connect to your database

5. Open this file on your computer:
   ```
   am-with-emailjs/admin-dashboard/database/postgresql_setup.sql
   ```

6. **Copy ALL the contents** of that file (Ctrl+A, Ctrl+C)

7. Go back to Render Shell tab

8. **Paste** the SQL code (Ctrl+V or right-click → Paste)

9. Press **Enter**

⏳ **Wait 10-20 seconds** - You'll see lots of output

✅ **Look for:** "Database setup completed successfully!"

### Option B: Using psql on Your Computer (If you have it installed)

1. Open Command Prompt or Terminal

2. Run this command (replace with your actual database URL):
   ```bash
   psql postgres://amfashions:PASSWORD@dpg-xxxxx.oregon-postgres.render.com/amfashions < admin-dashboard/database/postgresql_setup.sql
   ```

✅ **You should see:** "Database setup completed successfully!"

---

## Step 1.5: Verify Database Setup

1. In Render, go back to your database page
2. Click the **"Shell"** tab
3. Type this command:
   ```sql
   \dt
   ```
4. Press **Enter**

✅ **You should see a list of tables:**
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

**If you see these tables, you're good!** ✅

---

# PART 2: DEPLOY BACKEND TO RENDER

**Time: 10 minutes**

---

## Step 2.1: Create Web Service

1. Go back to Render Dashboard (click "Render" logo at top left)
2. Click **"New +"** button (top right)
3. Click **"Web Service"**

You'll see "Create a new Web Service" page.

---

## Step 2.2: Connect GitHub Repository

1. Look for the section that says **"Connect a repository"**

2. If you see your repository `am-fashions/am-with-emailjs`:
   - Click **"Connect"** next to it
   - Skip to Step 2.3

3. If you DON'T see your repository:
   - Click **"+ Connect account"** (GitHub icon)
   - Click **"Authorize Render"**
   - Select **"All repositories"** or select your specific repo
   - Click **"Install"**
   - Now you should see your repository
   - Click **"Connect"**

---

## Step 2.3: Configure Web Service

You'll see a form. Fill it out EXACTLY like this:

### Basic Configuration:

**Name:**
```
am-fashions-backend
```
(This will be part of your URL)

**Region:**
- **IMPORTANT:** Choose the **SAME region** as your database
- If database is in Oregon, choose Oregon
- If database is in Frankfurt, choose Frankfurt

**Branch:**
```
main
```
(Should be selected by default)

**Root Directory:**
```
admin-dashboard/server
```
⚠️ **IMPORTANT:** Type this exactly! This tells Render where your backend code is.

**Runtime:**
- Select **"Node"** from dropdown

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Instance Type:**
- Select **"Free"**
- You'll see: "Free - 512 MB RAM, Shared CPU"

---

## Step 2.4: Add Environment Variables

This is the most important part! Scroll down to **"Environment Variables"** section.

1. Click **"Add Environment Variable"** button

You need to add these variables ONE BY ONE:

### Variable 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Paste your Internal Database URL from Step 1.3
  ```
  postgres://amfashions:PASSWORD@dpg-xxxxx.oregon-postgres.render.com/amfashions
  ```
- Click **"Add Environment Variable"** again

### Variable 2: PORT
- **Key:** `PORT`
- **Value:** `5000`
- Click **"Add Environment Variable"** again

### Variable 3: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click **"Add Environment Variable"** again

### Variable 4: JWT_SECRET
- **Key:** `JWT_SECRET`
- **Value:** Generate a random string

**To generate JWT_SECRET:**
1. Open Command Prompt or Terminal
2. Run this command:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Copy the output (long random string)
4. Paste it as the value

Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

- Click **"Add Environment Variable"** again

### Variable 5: EMAIL_USER
- **Key:** `EMAIL_USER`
- **Value:** `madasumiteesh@gmail.com`
- Click **"Add Environment Variable"** again

### Variable 6: EMAIL_PASSWORD
- **Key:** `EMAIL_PASSWORD`
- **Value:** `mnfc xdxe ojpi rtzf`
- Click **"Add Environment Variable"** again

### Variable 7: ADMIN_EMAIL
- **Key:** `ADMIN_EMAIL`
- **Value:** `madasumiteesh@gmail.com`
- Click **"Add Environment Variable"** again

### Variable 8: FRONTEND_URL
- **Key:** `FRONTEND_URL`
- **Value:** `https://yourdomain.com`
  (We'll update this later with actual Vercel URL)
- Click **"Add Environment Variable"** again

### Variable 9: ADMIN_URL
- **Key:** `ADMIN_URL`
- **Value:** `https://admin.yourdomain.com`
  (We'll update this later with actual Vercel URL)

---

## Step 2.5: Create the Service

1. Scroll to the bottom
2. Click **"Create Web Service"** (big blue button)

⏳ **Wait 5-10 minutes** - You'll see the deployment logs

**What you'll see:**
- "Build started"
- "Installing dependencies..."
- "Build successful"
- "Starting service..."
- "Your service is live 🎉"

✅ **When done, you'll see "Live" in green at the top**

---

## Step 2.6: Get Your Backend URL

1. At the top of the page, you'll see your service URL
2. It looks like: `https://am-fashions-backend.onrender.com`
3. **COPY THIS URL** and save it in your notepad

---

## Step 2.7: Test Your Backend

1. Open a new browser tab
2. Go to: `https://am-fashions-backend.onrender.com/api/health`
   (Replace with your actual URL)

✅ **You should see:**
```json
{
  "status": "OK",
  "timestamp": "2024-02-11T...",
  "database": "Connected"
}
```

**If you see this, your backend is working!** 🎉

⚠️ **If you see an error:**
- Wait 1-2 minutes and try again (service might still be starting)
- Check the "Logs" tab in Render for errors
- Verify all environment variables are correct

---

# PART 3: DEPLOY MAIN WEBSITE TO VERCEL

**Time: 7 minutes**

---

## Step 3.1: Update Environment Variables Locally

1. Open your code editor
2. Open file: `am-with-emailjs/.env.production`
3. Update it with your actual backend URL:
   ```env
   REACT_APP_API_URL=https://am-fashions-backend.onrender.com/api
   ```
   (Replace with your actual Render backend URL from Step 2.6)
4. **Save the file**

---

## Step 3.2: Commit and Push Changes

1. Open Command Prompt or Terminal
2. Navigate to your project:
   ```bash
   cd am-with-emailjs
   ```
3. Run these commands:
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push origin main
   ```

✅ **Wait for push to complete**

---

## Step 3.3: Create Vercel Account

1. Open browser
2. Go to: **https://vercel.com**
3. Click **"Sign Up"** (top right)
4. Click **"Continue with GitHub"**
5. Click **"Authorize Vercel"**
6. You'll be redirected to Vercel Dashboard

✅ **You should see the Vercel Dashboard**

---

## Step 3.4: Import Project

1. Click **"Add New..."** button (top right)
2. Click **"Project"** from dropdown
3. You'll see "Import Git Repository" page

---

## Step 3.5: Connect Repository

1. Look for **"Import Git Repository"** section
2. Find your repository: `am-fashions/am-with-emailjs`
3. Click **"Import"** button next to it

If you don't see your repository:
- Click **"Adjust GitHub App Permissions"**
- Select your repository
- Click **"Install"**

---

## Step 3.6: Configure Project

You'll see "Configure Project" page. Fill it out:

### Project Configuration:

**Project Name:**
```
am-fashions
```
(Or any name you like - this will be part of your URL)

**Framework Preset:**
- Select **"Create React App"** from dropdown

**Root Directory:**
- Leave as **"./"** (default)
- Or click **"Edit"** and make sure it's blank or "./"

**Build and Output Settings:**

**Build Command:**
```
npm run build
```
(Should be auto-filled)

**Output Directory:**
```
build
```
(Should be auto-filled)

**Install Command:**
```
npm install
```
(Should be auto-filled)

---

## Step 3.7: Add Environment Variables

1. Expand **"Environment Variables"** section (click the arrow)
2. You'll see three fields: Key, Value, and Environment

**Add this variable:**
- **Key:** `REACT_APP_API_URL`
- **Value:** `https://am-fashions-backend.onrender.com/api`
  (Your actual Render backend URL)
- **Environment:** Leave all three checked (Production, Preview, Development)

3. Click **"Add"** button

---

## Step 3.8: Deploy

1. Scroll to bottom
2. Click **"Deploy"** (big blue button)

⏳ **Wait 3-5 minutes** - You'll see:
- "Building..."
- "Deploying..."
- "Success! 🎉"

✅ **When done, you'll see confetti and "Congratulations!"**

---

## Step 3.9: Get Your Website URL

1. You'll see a preview image of your site
2. Below it, click **"Continue to Dashboard"**
3. At the top, you'll see your URL: `https://am-fashions.vercel.app`
4. **COPY THIS URL** and save it in your notepad

---

## Step 3.10: Test Your Website

1. Click on your URL or open it in a new tab
2. You should see your website!

✅ **Test these:**
- Can you see products? ✅
- Can you click on a product? ✅
- Can you add to cart? ✅
- Can you view cart? ✅

**If everything works, you're good!** 🎉

---

# PART 4: DEPLOY ADMIN DASHBOARD TO VERCEL

**Time: 7 minutes**

---

## Step 4.1: Update Admin Environment Variables

1. Open your code editor
2. Open file: `am-with-emailjs/admin-dashboard/client/.env.production`
3. Update it:
   ```env
   VITE_API_URL=https://am-fashions-backend.onrender.com/api
   ```
   (Your actual Render backend URL)
4. **Save the file**

---

## Step 4.2: Commit and Push

```bash
git add .
git commit -m "Update admin production API URL"
git push origin main
```

✅ **Wait for push to complete**

---

## Step 4.3: Create New Vercel Project

1. Go to Vercel Dashboard
2. Click **"Add New..."** (top right)
3. Click **"Project"**

---

## Step 4.4: Import Same Repository

1. Find your repository: `am-fashions/am-with-emailjs`
2. Click **"Import"** button

**Note:** Yes, we're importing the same repository again! Vercel allows multiple projects from one repo.

---

## Step 4.5: Configure Admin Project

**Project Name:**
```
am-fashions-admin
```

**Framework Preset:**
- Select **"Vite"** from dropdown

**Root Directory:**
- Click **"Edit"**
- Type: `admin-dashboard/client`
- Click **"Continue"**

⚠️ **IMPORTANT:** Make sure Root Directory is set to `admin-dashboard/client`

**Build and Output Settings:**

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```
(Note: It's "dist" not "build" for Vite)

**Install Command:**
```
npm install
```

---

## Step 4.6: Add Environment Variables

1. Expand **"Environment Variables"**
2. Add this variable:

- **Key:** `VITE_API_URL`
- **Value:** `https://am-fashions-backend.onrender.com/api`
  (Your actual Render backend URL)
- Click **"Add"**

---

## Step 4.7: Deploy

1. Click **"Deploy"** button

⏳ **Wait 3-5 minutes**

✅ **When done, you'll see "Congratulations!"**

---

## Step 4.8: Get Admin URL

1. Click **"Continue to Dashboard"**
2. Copy your admin URL: `https://am-fashions-admin.vercel.app`
3. **SAVE THIS URL** in your notepad

---

## Step 4.9: Test Admin Dashboard

1. Open your admin URL in browser
2. You should see the login page

✅ **You should see:**
- Login form
- Email and password fields
- "Request Login" button

**Don't try to login yet!** We need to update CORS first.

---

# PART 5: UPDATE BACKEND CORS

**Time: 3 minutes**

Now we need to tell the backend to accept requests from your actual Vercel URLs.

---

## Step 5.1: Update Environment Variables in Render

1. Go back to Render Dashboard
2. Click on your backend service: **"am-fashions-backend"**
3. Click **"Environment"** tab (left sidebar)
4. You'll see all your environment variables

---

## Step 5.2: Update FRONTEND_URL

1. Find **"FRONTEND_URL"**
2. Click the **"Edit"** button (pencil icon)
3. Change the value to your actual website URL:
   ```
   https://am-fashions.vercel.app
   ```
   (Use your actual Vercel website URL from Step 3.9)
4. Click **"Save Changes"**

---

## Step 5.3: Update ADMIN_URL

1. Find **"ADMIN_URL"**
2. Click the **"Edit"** button
3. Change the value to your actual admin URL:
   ```
   https://am-fashions-admin.vercel.app
   ```
   (Use your actual Vercel admin URL from Step 4.8)
4. Click **"Save Changes"**

---

## Step 5.4: Redeploy Backend

After saving environment variables, Render will automatically redeploy.

⏳ **Wait 2-3 minutes** - You'll see:
- "Deploying..."
- "Live" (green)

✅ **When it says "Live", you're done!**

---

# PART 6: FINAL TESTING

**Time: 5 minutes**

Let's test everything end-to-end!

---

## Test 1: Backend Health Check

1. Open: `https://am-fashions-backend.onrender.com/api/health`

✅ **Should see:**
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "Connected"
}
```

---

## Test 2: Main Website

1. Open your website: `https://am-fashions.vercel.app`

✅ **Test these features:**
- [ ] Can see products
- [ ] Can click on a product
- [ ] Can add to cart
- [ ] Can view cart
- [ ] Can go to checkout
- [ ] Can fill out order form

**Try placing a test order:**
1. Add a product to cart
2. Go to checkout
3. Fill out the form
4. Upload a payment screenshot (any image)
5. Submit order

✅ **You should:**
- See "Order placed successfully!" message
- Receive an email confirmation

---

## Test 3: Admin Dashboard

1. Open admin: `https://am-fashions-admin.vercel.app`

✅ **Test login flow:**
1. Click "Request Login"
2. Enter email: `admin@amfashions.com`
3. Enter password: `admin123`
4. Click "Request Login"
5. Check your email (madasumiteesh@gmail.com)
6. Click the approval link in email
7. You should be logged in!

✅ **Test admin features:**
- [ ] Can see dashboard
- [ ] Can see statistics
- [ ] Can view orders
- [ ] Can view payment verifications
- [ ] Can see the test order you placed
- [ ] Can see payment screenshot

---

## Test 4: Check Browser Console

1. Open your website
2. Press **F12** (opens Developer Tools)
3. Click **"Console"** tab

✅ **Should NOT see:**
- ❌ CORS errors
- ❌ Network errors
- ❌ 404 errors

If you see errors, check:
- FRONTEND_URL and ADMIN_URL are correct in Render
- Backend is "Live" in Render
- All environment variables are set

---

# 🎉 CONGRATULATIONS!

## You've Successfully Deployed:

```
✅ PostgreSQL Database (Render)
✅ Backend API (Render)
✅ Main Website (Vercel)
✅ Admin Dashboard (Vercel)
✅ Email Notifications
✅ Payment Verification System
✅ SSL Certificates (Automatic)
```

---

## 📊 Your Live URLs

Write these down:

```
Main Website:     https://am-fashions.vercel.app
Admin Dashboard:  https://am-fashions-admin.vercel.app
Backend API:      https://am-fashions-backend.onrender.com
Database:         Render PostgreSQL (1GB)

Total Cost:       $0/month 🎉
```

---

## 🔄 How to Update Your Site

Whenever you make changes to your code:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

**That's it!** Both Render and Vercel will automatically deploy your changes.

---

## 💡 Important Notes

### Render Free Tier:
- ⚠️ Backend sleeps after 15 minutes of inactivity
- ⚠️ First request takes 30-60 seconds to wake up
- ✅ Database stays on 24/7

### To Keep Backend Awake (Optional):
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up (free)
3. Add monitor: `https://am-fashions-backend.onrender.com/api/health`
4. Set interval: 5 minutes
5. Your backend will never sleep!

---

## 🆘 Troubleshooting

### Backend is slow on first request
→ Normal! It's waking up from sleep (30-60 seconds)
→ Use UptimeRobot to keep it awake

### CORS errors in browser console
→ Check FRONTEND_URL and ADMIN_URL in Render
→ Make sure they match your Vercel URLs exactly
→ No trailing slashes!

### "Cannot connect to database"
→ Check DATABASE_URL in Render environment variables
→ Make sure you used Internal Database URL
→ Check database is "Available" in Render

### Admin login not working
→ Check email is being sent (check spam folder)
→ Verify EMAIL_USER and EMAIL_PASSWORD in Render
→ Check backend logs in Render

### Website shows blank page
→ Check browser console for errors (F12)
→ Verify REACT_APP_API_URL in Vercel
→ Check backend is responding

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Email**: madasumiteesh@gmail.com

---

## 🎊 What's Next?

### Optional Improvements:

1. **Add Custom Domain** (Free on Vercel):
   - Vercel Dashboard → Your project → Settings → Domains
   - Add your domain
   - Follow DNS instructions

2. **Set Up UptimeRobot** (Keep backend awake):
   - Prevents 30-second wake-up delay
   - 100% free

3. **Enable Analytics** (Free on Vercel):
   - Vercel Dashboard → Your project → Analytics
   - See visitor stats

4. **Backup Database** (Important!):
   ```bash
   pg_dump <your-database-url> > backup.sql
   ```
   - Do this weekly

5. **Monitor Usage**:
   - Render Dashboard → Usage
   - Vercel Dashboard → Usage
   - Make sure you're within free tier limits

---

## 🌟 You Did It!

You've deployed a professional e-commerce platform with:
- Product catalog
- Shopping cart
- Order management
- Payment verification
- Email notifications
- Admin dashboard
- Customer management

**All for $0/month!** 🚀

This is the same infrastructure used by many successful startups. You're ready to start selling!

**Congratulations!** 🎉🎉🎉
