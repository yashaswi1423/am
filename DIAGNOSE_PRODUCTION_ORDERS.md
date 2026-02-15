# Diagnose Production Orders Issue

## Problem
Orders work on localhost but don't appear in admin dashboard when deployed to production.

## Root Causes

### 1. Database Connection Mismatch
**Most Likely Issue**: Your production backend is connecting to a different database than your local setup.

**Check:**
```bash
# In Vercel dashboard for your backend deployment:
# Settings > Environment Variables
# Look for: DATABASE_URL, POSTGRES_URL, or MySQL credentials
```

### 2. Multiple Backend Deployments
You might have TWO separate backend deployments:
- Main website backend: `https://am-git-main-yashaswis-projects-bedecf50.vercel.app`
- Admin dashboard backend: (possibly different URL)

**Check:**
- Are both the main website AND admin dashboard pointing to the SAME backend URL?
- Current config shows both using: `https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api`

### 3. Environment Variables Not Set in Vercel

**Required Environment Variables for Backend:**
```
DATABASE_URL=postgresql://user:password@host/database
# OR
POSTGRES_URL=postgresql://user:password@host/database
# OR for MySQL
DB_HOST=your-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
```

## Step-by-Step Fix

### Step 1: Verify Database Connection in Production

Add this test endpoint to check what database your production backend is using:

**File: `am-main/admin-dashboard/server/server.js`**

Add this route:
```javascript
// Test endpoint to verify database connection
app.get('/api/test/db-info', async (req, res) => {
  try {
    const dbType = process.env.DATABASE_URL || process.env.POSTGRES_URL ? 'PostgreSQL' : 'MySQL';
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasPostgresUrl = !!process.env.POSTGRES_URL;
    const hasMysqlConfig = !!(process.env.DB_HOST && process.env.DB_USER);
    
    // Get count of orders
    const orderCount = await db.getOne('SELECT COUNT(*) as count FROM orders');
    
    res.json({
      success: true,
      database_type: dbType,
      has_database_url: hasDbUrl,
      has_postgres_url: hasPostgresUrl,
      has_mysql_config: hasMysqlConfig,
      order_count: orderCount.count,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});
```

Then visit: `https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/test/db-info`

### Step 2: Check Vercel Environment Variables

1. Go to Vercel Dashboard
2. Select your backend project
3. Go to Settings > Environment Variables
4. Verify these are set:
   - `DATABASE_URL` or `POSTGRES_URL` (for PostgreSQL/Supabase)
   - OR `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (for MySQL)

### Step 3: Check if Orders Are Being Created

Add logging to the order creation endpoint:

**File: `am-main/admin-dashboard/server/controllers/ordersController.js`**

The logging is already there! Check Vercel logs:
1. Go to Vercel Dashboard
2. Select your backend project
3. Click "Deployments" > Latest deployment > "View Function Logs"
4. Place a test order from your website
5. Look for logs starting with `=== CREATE ORDER REQUEST ===`

### Step 4: Verify Both Frontends Use Same Backend

**Main Website API:** `am-main/src/services/api.js`
```javascript
const API_BASE_URL = 'https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api';
```

**Admin Dashboard API:** `am-main/admin-dashboard/client/src/services/api.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api'
```

✅ Both are pointing to the same backend - this is correct!

### Step 5: Test Order Creation Directly

Use this curl command to test order creation directly:

```bash
curl -X POST https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_name": "Test Product",
        "variant_details": "Size: M",
        "quantity": 1,
        "unit_price": 100,
        "subtotal": 100
      }
    ],
    "shipping_address": "Test Address",
    "subtotal": 100,
    "total_amount": 100
  }'
```

Then check if this order appears in your admin dashboard.

## Common Solutions

### Solution 1: Database Not Migrated to Production
If you're using a different database in production, you need to run the schema:

```sql
-- Run this on your PRODUCTION database
-- File: am-main/admin-dashboard/database/schema.sql
```

### Solution 2: Wrong Database Credentials
Update Vercel environment variables with correct database credentials:
1. Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add/Update: `DATABASE_URL` or `POSTGRES_URL`
3. Redeploy

### Solution 3: CORS Issues Preventing Order Creation
Check browser console when placing an order:
- Open DevTools (F12)
- Go to Network tab
- Place an order
- Look for failed requests (red)
- Check if CORS errors appear

### Solution 4: Two Different Databases
You might be:
- Using MySQL locally
- Using PostgreSQL (Supabase) in production
- But they're not synced!

**Fix:** Ensure both environments use the same database OR sync data between them.

## Quick Test Checklist

- [ ] Visit `/api/test/db-info` endpoint to see database info
- [ ] Check Vercel logs when placing an order
- [ ] Verify environment variables in Vercel dashboard
- [ ] Test order creation with curl command
- [ ] Check browser console for errors when placing order
- [ ] Verify database schema exists in production database
- [ ] Confirm both frontends use same backend URL

## Most Likely Issue

Based on the code analysis, the most likely issue is:

**Your production backend is connecting to an EMPTY or DIFFERENT database than your local one.**

**Quick Fix:**
1. Check Vercel environment variables
2. Verify `DATABASE_URL` or `POSTGRES_URL` points to the correct database
3. Run the schema SQL on that production database
4. Redeploy

## Need More Help?

Provide these details:
1. Output from `/api/test/db-info` endpoint
2. Vercel function logs when placing an order
3. Browser console errors when placing an order
4. Which database you're using (MySQL, PostgreSQL, Supabase)
