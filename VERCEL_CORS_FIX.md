# VERCEL API CONNECTION FIX - SOLVED ✓

## The ACTUAL Problem (Not CORS!)
The frontend was using **relative URLs** (`/api`) which only work when frontend and backend are on the same domain. Since your frontend (www.am-fashions.in) and backend (am-git-main-yashaswis-projects-bedecf50.vercel.app) are deployed separately, the API calls were failing with 500 errors.

## The Solution
Updated the frontend to use **absolute URLs** pointing to your backend domain.

## Files Changed

1. **am/src/services/api.js** - Updated API base URL
2. **am/src/pages/Cart.jsx** - Updated payment verification URL
3. **am/.env.production** - Added backend URL environment variable

## Quick Deploy Steps

### Step 1: Push Changes to Git
```bash
cd am
git add .
git commit -m "Fix: Connect frontend to backend API"
git push
```

### Step 2: Add Environment Variable on Vercel
1. Go to Vercel Dashboard → Your Frontend Project (www.am-fashions.in)
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api`
4. Save

### Step 3: Redeploy Frontend
1. Go to Deployments tab
2. Click latest deployment → Three dots menu → "Redeploy"
3. **IMPORTANT**: Uncheck "Use existing Build Cache"
4. Click "Redeploy"

### Step 4: Test
1. Visit www.am-fashions.in
2. Add items to cart
3. Fill address and proceed to payment
4. Submit payment - should work now! ✓

## What Was Wrong?

**Before:**
```javascript
// This tried to call www.am-fashions.in/api (doesn't exist!)
const API_URL = '/api';
```

**After:**
```javascript
// This correctly calls your backend
const API_URL = 'https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api';
```


## Optional: Use Custom Domain for Backend (Recommended)

For a cleaner setup, you can add a custom subdomain for your backend:

1. Add `api.am-fashions.in` as a domain to your backend project
2. Update environment variable to `https://api.am-fashions.in/api`
3. Redeploy frontend

This makes your setup more professional and easier to manage.

## Troubleshooting

If you still see errors after deploying:

1. **Check browser console** - Look for the actual error message
2. **Verify environment variable** - Make sure `REACT_APP_API_URL` is set in Vercel
3. **Test backend directly** - Visit `https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/health`
4. **Clear cache** - Hard refresh your browser (Ctrl+Shift+R)

## Backend Health Check

Test if your backend is working:
```bash
curl https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2026-02-13T...",
  "database": "Connected"
}
```

If this fails, check your backend environment variables (DATABASE_URL, SUPABASE_URL, etc.)

