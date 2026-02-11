# 📸 Vercel Deployment - Visual Guide

This guide shows you exactly what to click and where.

---

## 🎯 PART 1: Deploy Backend API

### Step 1: Go to Vercel
1. Open browser
2. Go to: **https://vercel.com/new**
3. You'll see "Import Git Repository" page

### Step 2: Import Repository
1. Look for "Import Git Repository" section
2. Find your repository: **am-fashions/aaaaaa**
3. Click **"Import"** button next to it

### Step 3: Configure Project
You'll see a configuration page with these fields:

**PROJECT NAME**: (auto-filled, you can change it)
- Suggestion: `am-fashions-backend`

**FRAMEWORK PRESET**: 
- Select: **"Other"** from dropdown

**ROOT DIRECTORY**: 
- Click **"Edit"** button
- Type: `admin-dashboard/server`
- Click **"Continue"**

**BUILD AND OUTPUT SETTINGS**:
- Build Command: Leave empty
- Output Directory: Leave empty
- Install Command: `npm install` (auto-filled)

### Step 4: Add Environment Variables
1. Click **"Environment Variables"** section to expand
2. You'll see three fields: Name, Value, and dropdown
3. Add these ONE BY ONE:

**Variable 1:**
- Name: `SUPABASE_URL`
- Value: `https://ghekzhxusoijeolsjnlo.supabase.co`
- Click "Add"

**Variable 2:**
- Name: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWt6aHh1c29pamVvbHNqbmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTQwNjYsImV4cCI6MjA4NjM5MDA2Nn0.n9pCHjGrCp1lM6hj9u8jg4SKE4a1n6VRNGhgAV1dyz4`
- Click "Add"

**Variable 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWt6aHh1c29pamVvbHNqbmxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDgxNDA2NiwiZXhwIjoyMDg2MzkwMDY2fQ.O8uYMQ1QqsVsszF6U7Y5xcBS--fiRH1duf9gUfxHDgo`
- Click "Add"

**Variable 4:**
- Name: `DATABASE_URL`
- Value: `postgresql://postgres:AM_fashions1102@db.ghekzhxusoijeolsjnlo.supabase.co:5432/postgres`
- Click "Add"

**Variable 5:**
- Name: `PORT`
- Value: `5000`
- Click "Add"

**Variable 6:**
- Name: `NODE_ENV`
- Value: `production`
- Click "Add"

**Variable 7:**
- Name: `JWT_SECRET`
- Value: `am-fashions-super-secret-jwt-key-2026-production-v1`
- Click "Add"

**Variable 8:**
- Name: `EMAIL_HOST`
- Value: `smtp.gmail.com`
- Click "Add"

**Variable 9:**
- Name: `EMAIL_PORT`
- Value: `587`
- Click "Add"

**Variable 10:**
- Name: `EMAIL_USER`
- Value: `madasumiteesh@gmail.com`
- Click "Add"

**Variable 11:**
- Name: `EMAIL_PASS`
- Value: `mnfc xdxe ojpi rtzf`
- Click "Add"

**Variable 12:**
- Name: `EMAIL_FROM`
- Value: `AM Fashiona <madasumiteesh@gmail.com>`
- Click "Add"

**Variable 13:**
- Name: `ADMIN_EMAIL`
- Value: `madasumiteesh@gmail.com`
- Click "Add"

### Step 5: Deploy
1. Scroll down
2. Click big blue **"Deploy"** button
3. Wait 2-3 minutes (you'll see build logs)
4. When done, you'll see "Congratulations!" with confetti 🎉

### Step 6: Get Your Backend URL
1. You'll see a preview image of your deployment
2. Below it, there's a URL like: `https://am-fashions-backend-xyz.vercel.app`
3. **COPY THIS URL** - you'll need it for the next steps
4. Click "Continue to Dashboard"

### Step 7: Test Backend
1. Open new browser tab
2. Go to: `https://your-backend-url.vercel.app/api/health`
3. You should see: `{"status":"ok","database":"connected"}`
4. If you see this, backend is working! ✅

---

## 🎯 PART 2: Deploy Admin Dashboard

### Step 1: Go to Vercel Again
1. Go to: **https://vercel.com/new**
2. You'll see "Import Git Repository" page again

### Step 2: Import Repository
1. Find your repository: **am-fashions/aaaaaa**
2. Click **"Import"** button

### Step 3: Configure Project
**PROJECT NAME**: 
- Suggestion: `am-fashions-admin`

**FRAMEWORK PRESET**: 
- Select: **"Vite"** from dropdown

**ROOT DIRECTORY**: 
- Click **"Edit"** button
- Type: `admin-dashboard/client`
- Click **"Continue"**

**BUILD AND OUTPUT SETTINGS**:
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)
- Install Command: `npm install` (auto-filled)

### Step 4: Add Environment Variable
1. Click **"Environment Variables"** section
2. Add ONE variable:

**Variable:**
- Name: `VITE_API_URL`
- Value: `https://YOUR-BACKEND-URL.vercel.app/api`
- **⚠️ IMPORTANT**: Replace `YOUR-BACKEND-URL` with the URL from Part 1, Step 6
- Example: `https://am-fashions-backend-xyz.vercel.app/api`
- Click "Add"

### Step 5: Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes
3. You'll see "Congratulations!" 🎉

### Step 6: Get Your Admin URL
1. Copy the URL: `https://am-fashions-admin-xyz.vercel.app`
2. **SAVE THIS URL**
3. Click "Continue to Dashboard"

### Step 7: Test Admin Dashboard
1. Open new browser tab
2. Go to your admin URL
3. You should see the login page
4. Try logging in:
   - Email: `admin@amfashions.com`
   - Password: `admin123`
5. If dashboard loads, it's working! ✅

---

## 🎯 PART 3: Deploy Main Website

### Step 1: Go to Vercel Again
1. Go to: **https://vercel.com/new**

### Step 2: Import Repository
1. Find: **am-fashions/aaaaaa**
2. Click **"Import"**

### Step 3: Configure Project
**PROJECT NAME**: 
- Suggestion: `am-fashions-website`

**FRAMEWORK PRESET**: 
- Select: **"Create React App"** from dropdown

**ROOT DIRECTORY**: 
- **Leave this EMPTY** (or select "." for root)
- Click **"Continue"**

**BUILD AND OUTPUT SETTINGS**:
- Build Command: `npm run build` (auto-filled)
- Output Directory: `build` (auto-filled)
- Install Command: `npm install` (auto-filled)

### Step 4: Add Environment Variable
1. Click **"Environment Variables"** section
2. Add ONE variable:

**Variable:**
- Name: `REACT_APP_API_URL`
- Value: `https://YOUR-BACKEND-URL.vercel.app/api`
- **⚠️ IMPORTANT**: Use the backend URL from Part 1, Step 6
- Example: `https://am-fashions-backend-xyz.vercel.app/api`
- Click "Add"

### Step 5: Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes
3. You'll see "Congratulations!" 🎉

### Step 6: Get Your Website URL
1. Copy the URL: `https://am-fashions-website-xyz.vercel.app`
2. **SAVE THIS URL**
3. Click "Continue to Dashboard"

### Step 7: Test Website
1. Open new browser tab
2. Go to your website URL
3. You should see the homepage with products
4. Try adding items to cart
5. If it works, website is live! ✅

---

## 🎯 PART 4: Update Backend CORS

This is the FINAL step to connect everything!

### Step 1: Go to Backend Project
1. Go to: **https://vercel.com/dashboard**
2. Click on your backend project (e.g., `am-fashions-backend`)

### Step 2: Go to Settings
1. Click **"Settings"** tab at the top
2. Click **"Environment Variables"** in the left sidebar

### Step 3: Add Two More Variables
1. Click **"Add New"** button

**Variable 1:**
- Name: `FRONTEND_URL`
- Value: `https://your-website-url.vercel.app`
- Use the URL from Part 3, Step 6
- Select: Production, Preview, Development (all three)
- Click "Save"

**Variable 2:**
- Name: `ADMIN_URL`
- Value: `https://your-admin-url.vercel.app`
- Use the URL from Part 2, Step 6
- Select: Production, Preview, Development (all three)
- Click "Save"

### Step 4: Redeploy Backend
1. Click **"Deployments"** tab at the top
2. Find the latest deployment (top of the list)
3. Click the three dots **"..."** on the right
4. Click **"Redeploy"**
5. Click **"Redeploy"** again to confirm
6. Wait 1-2 minutes

---

## ✅ FINAL TEST

### Test Complete Flow:

1. **Open Website**
   - Go to your website URL
   - Browse products
   - Add items to cart
   - Proceed to checkout
   - Fill shipping information
   - Upload payment screenshot
   - Submit order

2. **Check Admin Dashboard**
   - Go to your admin URL
   - Login with admin credentials
   - Go to Orders page
   - Your test order should appear!
   - Go to Payment Verifications
   - Your payment screenshot should be there!

3. **Check Email**
   - Check your email inbox
   - You should receive order confirmation
   - Admin should receive payment verification email

---

## 🎉 SUCCESS!

If all tests pass, your platform is LIVE and working!

### Your Live URLs:
```
Website:  https://_________________.vercel.app
Admin:    https://_________________.vercel.app
Backend:  https://_________________.vercel.app
```

---

## 📱 What's Next?

1. **Share your website URL** with customers
2. **Add more products** in admin dashboard
3. **Test thoroughly** with real orders
4. **Add custom domain** (optional)
5. **Start selling!** 🚀

---

## 🆘 Troubleshooting

### If Backend Health Check Fails:
- Check all environment variables are added correctly
- Verify DATABASE_URL has no typos
- Check Supabase project is active
- Redeploy backend

### If Admin Dashboard Shows Blank Page:
- Check browser console for errors (F12)
- Verify VITE_API_URL is correct
- Make sure it ends with `/api`
- Check backend is accessible

### If Website Shows Errors:
- Check browser console (F12)
- Verify REACT_APP_API_URL is correct
- Test backend health endpoint
- Clear browser cache

### If CORS Errors:
- Make sure you completed Part 4
- Verify FRONTEND_URL and ADMIN_URL are set
- Check URLs don't have trailing slashes
- Redeploy backend after adding variables

---

## 📞 Need Help?

- Check: `COMPLETE_HOSTING_GUIDE.md`
- Email: madasumiteesh@gmail.com
- Vercel Docs: https://vercel.com/docs

---

**🎊 Congratulations on deploying your e-commerce platform!**
