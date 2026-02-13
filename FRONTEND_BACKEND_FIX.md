# Frontend-Backend Connection Fix

## Problem
The frontend was using relative URLs (`/api`) which only work when frontend and backend are on the same domain. Since they're deployed separately on Vercel, the API calls were failing with 500 errors.

## Solution Applied

### 1. Updated API Configuration
- **File**: `am/src/services/api.js`
- **Change**: Now uses absolute backend URL instead of relative URL
- **URL**: `https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api`

### 2. Updated Payment Verification Call
- **File**: `am/src/pages/Cart.jsx`
- **Change**: Payment verification now calls the correct backend URL

### 3. Created Environment File
- **File**: `am/.env.production`
- **Content**: `REACT_APP_API_URL=https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api`

## Deployment Steps

### Step 1: Commit and Push Changes
```bash
cd am
git add .
git commit -m "Fix: Update API URLs to use absolute backend URL"
git push
```

### Step 2: Redeploy Frontend on Vercel
1. Go to Vercel Dashboard
2. Find your frontend project (www.am-fashions.in)
3. Go to Settings → Environment Variables
4. Add: `REACT_APP_API_URL` = `https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api`
5. Go to Deployments tab
6. Click "Redeploy" on the latest deployment
7. Uncheck "Use existing Build Cache"
8. Click "Redeploy"

### Step 3: Verify Backend is Running
Test the backend health endpoint:
```bash
curl https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "Connected"
}
```

### Step 4: Test Payment Flow
1. Go to www.am-fashions.in
2. Add items to cart
3. Fill in address details
4. Click "Proceed to Payment"
5. Complete payment steps
6. Submit payment verification

## Alternative: Use Custom Backend Domain (Recommended)

If you want a cleaner setup, you can:

1. **Add a custom domain to your backend** (e.g., `api.am-fashions.in`)
2. **Update environment variable** to use the custom domain
3. **Redeploy frontend**

This makes the setup more professional and easier to manage.

## Troubleshooting

### If you still see errors:

1. **Check browser console** for the actual error message
2. **Check Vercel logs** for backend errors
3. **Verify environment variables** are set correctly
4. **Clear browser cache** and try again

### Common Issues:

- **CORS errors**: Backend CORS is already configured correctly
- **500 errors**: Usually database connection or missing environment variables
- **404 errors**: Wrong API URL or route not found

## Environment Variables Checklist

### Backend (am-git-main-yashaswis-projects-bedecf50)
- ✓ `DATABASE_URL` - PostgreSQL connection string
- ✓ `SUPABASE_URL` - Supabase project URL
- ✓ `SUPABASE_ANON_KEY` - Supabase anonymous key
- ✓ `NODE_ENV=production`

### Frontend (www.am-fashions.in)
- ✓ `REACT_APP_API_URL` - Backend API URL

## Next Steps

After redeploying, the payment flow should work correctly. The frontend will now properly communicate with the backend API.
