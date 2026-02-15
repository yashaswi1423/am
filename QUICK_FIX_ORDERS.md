# Quick Fix: Orders Not Showing in Production

## The Problem
✅ Orders work on localhost  
❌ Orders don't show in admin dashboard when deployed

## Most Likely Cause
Your production backend is connected to a **different or empty database** than your local setup.

## Quick Fix (5 minutes)

### Step 1: Open the Test Tool
1. Open `test-production-orders.html` in your browser
2. Click "Check Database Info"
3. Look at the order count

**If order count is 0:**
- Your production database is empty or not connected properly

### Step 2: Check Vercel Environment Variables
1. Go to https://vercel.com/dashboard
2. Find your backend project (the one with the API)
3. Go to: Settings → Environment Variables
4. Look for these variables:

**For PostgreSQL/Supabase:**
```
DATABASE_URL=postgresql://user:password@host/database
```

**For MySQL:**
```
DB_HOST=your-host
DB_USER=your-user  
DB_PASSWORD=your-password
DB_NAME=your-database
```

### Step 3: Verify Database Has Schema
Your production database needs these tables:
- `orders`
- `order_items`
- `customers`
- `products`
- `payments`

**To create them:**
1. Connect to your production database
2. Run the SQL from: `admin-dashboard/database/schema.sql`

### Step 4: Test It
1. In `test-production-orders.html`, click "Create Test Order"
2. Check if order appears in admin dashboard
3. If it appears → Problem solved! ✅
4. If it doesn't → Continue to Step 5

### Step 5: Check Vercel Logs
1. Go to Vercel Dashboard
2. Click on your backend deployment
3. Go to "Deployments" → Latest → "View Function Logs"
4. Place an order from your website
5. Look for errors in the logs

## Common Issues & Solutions

### Issue 1: "No orders found in database"
**Solution:** Your production database is empty. Run the schema SQL.

### Issue 2: "Database connection error"
**Solution:** Check environment variables in Vercel. Make sure DATABASE_URL is correct.

### Issue 3: Orders appear in test but not from website
**Solution:** Your main website might be hitting a different backend URL.

Check these files:
- `src/services/api.js` - Should have: `https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api`
- `admin-dashboard/client/src/services/api.js` - Should have the same URL

### Issue 4: Two different databases
**Symptom:** Orders show on localhost but not production

**Solution:** You're using:
- MySQL locally
- PostgreSQL (Supabase) in production

They're separate databases! Choose one:

**Option A: Use same database everywhere**
- Update local `.env` to use production database URL

**Option B: Keep separate but sync**
- Export data from local MySQL
- Import to production PostgreSQL

## Diagnostic Endpoints

After deploying the updated server, visit these URLs:

### 1. Database Info
```
https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/test/db-info
```
Shows:
- Database type (MySQL/PostgreSQL)
- Order count
- Recent orders

### 2. API Health
```
https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/health
```
Shows:
- API status
- Database connection status

### 3. Recent Orders
```
https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/orders
```
Shows all orders (requires admin auth)

## Still Not Working?

### Collect This Information:

1. **Database Info Response:**
   - Visit `/api/test/db-info`
   - Copy the entire JSON response

2. **Vercel Environment Variables:**
   - List all DB-related env vars (hide passwords)
   - Example: `DATABASE_URL=postgresql://user:***@host/db`

3. **Browser Console Errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Place an order
   - Copy any red errors

4. **Vercel Function Logs:**
   - Go to Vercel → Deployments → Latest → Logs
   - Place an order
   - Copy the logs

5. **Which database are you using?**
   - [ ] MySQL (local)
   - [ ] PostgreSQL (Neon)
   - [ ] Supabase
   - [ ] Other

## Deploy the Fix

After adding the diagnostic endpoint:

```bash
cd am-main/admin-dashboard/server
git add .
git commit -m "Add database diagnostic endpoint"
git push
```

Vercel will auto-deploy. Then visit:
```
https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api/test/db-info
```

## Expected Result

After fixing, you should see:
- ✅ Orders created from website appear in admin dashboard immediately
- ✅ Order count in `/api/test/db-info` increases when orders are placed
- ✅ Same orders visible in both localhost and production (if using same DB)

## Prevention

To avoid this in the future:
1. Use the same database for local and production
2. Or clearly document which database each environment uses
3. Set up database migrations/backups
4. Test order creation after every deployment
