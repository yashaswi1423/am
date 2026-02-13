# VERCEL CORS FIX - CRITICAL STEPS

## The Problem
CORS errors are blocking API requests from your frontend (www.am-fashions.in) to your backend (am-git-main-yashaswis-projects-bedecf50.vercel.app).

## Solution: Configure Vercel Project Settings

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Find your backend project (the one with URL: am-git-main-yashaswis-projects-bedecf50.vercel.app)
3. Click on the project

### Step 2: Check Environment Variables
Go to Settings → Environment Variables and ensure these are set:

**Required Variables:**
```
DATABASE_URL=postgresql://neondb_owner:npg_IhX52JDTHdjM@ep-curly-dust-aimzducq-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production
PORT=5000
```

### Step 3: Redeploy from Vercel Dashboard
1. Go to Deployments tab
2. Click on the latest deployment
3. Click the three dots (•••) menu
4. Click "Redeploy"
5. Check "Use existing Build Cache" is UNCHECKED
6. Click "Redeploy"

### Step 4: Check Deployment Logs
After redeployment:
1. Go to the deployment
2. Click "View Function Logs"
3. Look for any errors related to CORS or database connection

### Step 5: Test the API Directly
Open this URL in your browser:
```
https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "Connected"
}
```

If you see an authentication page or error, the project might have password protection enabled.

### Step 6: Remove Password Protection (if enabled)
1. Go to Settings → Deployment Protection
2. If "Vercel Authentication" is enabled, disable it
3. Save changes
4. Redeploy

### Step 7: Verify CORS Headers
Open browser console and run:
```javascript
fetch('https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/health', {
  method: 'OPTIONS'
}).then(r => {
  console.log('CORS Headers:', r.headers.get('access-control-allow-origin'));
});
```

Should log: `*` or your frontend domain

## Alternative Solution: Use Vercel's Built-in CORS

If the above doesn't work, we need to configure CORS at the Vercel platform level:

1. In your backend project root, ensure `vercel.json` has:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

2. Commit and push changes
3. Vercel will auto-deploy

## Last Resort: Contact Vercel Support

If none of the above works, there might be a Vercel account-level restriction. Contact Vercel support with:
- Your project URL
- The CORS error message
- Request help configuring CORS for serverless functions

## Quick Test Command

Run this in your terminal to test if backend is accessible:
```bash
curl -X OPTIONS https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/customers -H "Origin: https://www.am-fashions.in" -v
```

Look for `Access-Control-Allow-Origin` in the response headers.
