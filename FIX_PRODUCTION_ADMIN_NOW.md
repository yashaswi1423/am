# 🔧 Fix Production Admin Dashboard NOW

## The Problem
- ✅ Local admin (localhost:3001) shows items correctly
- ❌ Production admin (admin.am-fashions.in) shows "No items found"

## The Cause
The production admin dashboard doesn't have the `VITE_API_URL` environment variable set in Vercel, so it's using the hardcoded fallback URL.

## The Fix (2 minutes)

### Step 1: Add Environment Variable in Vercel

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Find your **Admin Dashboard** project
3. Click on it
4. Go to **Settings** → **Environment Variables**
5. Click **Add New**
6. Add this:
   ```
   Name: VITE_API_URL
   Value: https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api
   ```
7. Select: **Production**, **Preview**, and **Development**
8. Click **Save**

### Step 2: Redeploy Admin Dashboard

After adding the environment variable:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **...** menu (three dots)
4. Click **Redeploy**
5. Confirm redeploy

### Step 3: Wait (2-3 minutes)

Vercel will redeploy the admin dashboard with the new environment variable.

### Step 4: Test

1. Go to https://admin.am-fashions.in
2. Login
3. Go to Orders
4. Click on any order
5. **Order items should now show!**

## Why This Fixes It

The admin dashboard code checks for `VITE_API_URL`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'fallback-url'
```

Without the environment variable, it uses the fallback URL which might be pointing to the wrong backend or an old deployment.

With the environment variable set, it will use the correct backend URL.

## Verify It's Working

After redeployment, open browser console (F12) on the admin dashboard and you should see:
```
Admin Dashboard API URL: https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api
```

## Alternative Quick Fix

If you can't access Vercel right now, you can also:

1. Update `.env.production` file:
   ```env
   VITE_API_URL=https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api
   ```

2. Push to GitHub:
   ```bash
   cd am/admin-dashboard/client
   # Edit .env.production
   cd ../..
   git add .
   git commit -m "Fix: Add production API URL"
   git push origin main
   ```

3. Vercel will auto-deploy

---

**Time to Fix**: 2-3 minutes + 2-3 minutes deployment = ~5 minutes total
