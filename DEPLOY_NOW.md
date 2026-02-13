# 🚀 DEPLOY NOW - Quick Fix Guide

## What Was Wrong?
Your frontend was trying to call `/api` (relative URL) which doesn't exist on www.am-fashions.in. It needs to call your backend at `am-git-main-yashaswis-projects-bedecf50.vercel.app`.

## What I Fixed
✅ Updated `am/src/services/api.js` - Now uses absolute backend URL
✅ Updated `am/src/pages/Cart.jsx` - Payment verification uses correct URL
✅ Created `am/.env.production` - Environment variable for backend URL

## Deploy in 3 Steps

### 1️⃣ Push Code to Git
```bash
cd am
git add .
git commit -m "Fix: Connect frontend to backend API"
git push
```

### 2️⃣ Add Environment Variable on Vercel
1. Go to https://vercel.com/dashboard
2. Click on your **frontend project** (www.am-fashions.in)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api`
   - **Environment**: Select all (Production, Preview, Development)
6. Click **Save**

### 3️⃣ Redeploy Frontend
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots (•••)** menu
4. Click **"Redeploy"**
5. **IMPORTANT**: Uncheck "Use existing Build Cache"
6. Click **"Redeploy"**

## Test It!
1. Visit www.am-fashions.in
2. Add items to cart
3. Fill in delivery address
4. Click "Proceed to Payment"
5. Complete payment and submit screenshot
6. Should work now! ✓

## Verify Backend is Working
Open this in your browser:
```
https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/health
```

Should show:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "Connected"
}
```

## Need Help?
- Check browser console (F12) for errors
- Check Vercel deployment logs
- Make sure environment variable is saved
- Try hard refresh (Ctrl+Shift+R)

---

**That's it! Your payment system should work after these 3 steps.** 🎉
