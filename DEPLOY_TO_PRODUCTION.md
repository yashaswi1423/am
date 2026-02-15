# 🚀 Deploy to Production - Complete Guide

## ✅ What's Working Locally
- Order items are being saved correctly
- Admin dashboard shows all order details
- MySQL database has proper schema

## 🎯 Goal
Deploy to production (Vercel + Supabase PostgreSQL) with the same functionality.

## 📋 Pre-Deployment Checklist

### 1. Verify Local Changes
- [x] MySQL database wrapper fixed
- [x] Admin dashboard API uses environment variables
- [x] Order items saving correctly
- [x] Test script confirms data in database

### 2. Files to Commit
```bash
# Modified files
am/admin-dashboard/server/config/database-mysql.js
am/admin-dashboard/client/src/services/api.js

# New files
am/admin-dashboard/client/.env.local
am/admin-dashboard/server/test-orders.js
am/FIX_ORDER_ITEMS_ISSUE.md
am/TEST_ORDER_ITEMS_LOCALLY.md
am/ORDER_ITEMS_FIXED.md
am/QUICK_START_LOCAL.md
am/DEPLOY_TO_PRODUCTION.md
```

## 🗄️ Step 1: Setup Supabase Database

### A. Access Supabase
1. Go to https://supabase.com
2. Open your project
3. Go to **SQL Editor**

### B. Run Database Setup
Copy and paste the entire content of this file:
```
am/admin-dashboard/database/postgresql_setup.sql
```

Click **Run** to create all tables.

### C. Verify Tables Created
Run this query to check:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- admins
- customers
- orders
- **order_items** ← Most important!
- payments
- payment_verifications
- products
- product_variants
- coupons
- returns

### D. Create Admin User
Run this query (replace with your email):
```sql
INSERT INTO admins (username, email, password_hash, full_name, role) 
VALUES (
  'admin', 
  'your-email@gmail.com', 
  '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 
  'Admin User', 
  'super_admin'
);
```

## 🔧 Step 2: Configure Environment Variables

### A. Backend Server (Vercel)

Go to your backend Vercel project settings → Environment Variables:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
POSTGRES_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# Supabase Storage
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com

# API Configuration
API_BASE_URL=https://your-backend.vercel.app
BACKEND_URL=https://your-backend.vercel.app

# Server Configuration
PORT=5000
NODE_ENV=production
```

**Important**: Get your Supabase credentials from:
- Project Settings → Database → Connection string
- Project Settings → API → Project URL and anon key

### B. Admin Dashboard (Vercel)

Go to admin dashboard Vercel project → Environment Variables:

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

Replace `your-backend.vercel.app` with your actual backend URL.

### C. Customer Website (Vercel)

No changes needed - it already uses the backend URL.

## 📤 Step 3: Push to GitHub

### A. Check Git Status
```bash
cd am
git status
```

### B. Add All Changes
```bash
git add .
```

### C. Commit Changes
```bash
git commit -m "Fix: Order items now display correctly in admin dashboard

- Fixed MySQL database wrapper for local development
- Updated admin dashboard API to use environment variables
- Added .env.local for local development
- Confirmed order items are being saved to database
- Added test scripts and documentation
- Ready for production deployment with PostgreSQL"
```

### D. Push to GitHub
```bash
git push origin main
```

## 🚀 Step 4: Deploy to Vercel

### A. Backend Deployment
1. Vercel will auto-deploy when you push to GitHub
2. Wait for deployment to complete
3. Check deployment logs for errors
4. Test health endpoint: `https://your-backend.vercel.app/api/health`

### B. Admin Dashboard Deployment
1. Vercel will auto-deploy
2. Wait for deployment to complete
3. Verify environment variable is set: `VITE_API_URL`

### C. Customer Website Deployment
1. Vercel will auto-deploy
2. Wait for deployment to complete

## ✅ Step 5: Verify Production

### A. Test Database Connection
Check backend deployment logs for:
```
🗄️  Using PostgreSQL database
✅ PostgreSQL Database connected successfully
```

### B. Test Order Creation
1. Go to your customer website
2. Add product to cart
3. Complete checkout
4. Submit payment details

### C. Verify in Admin Dashboard
1. Go to admin dashboard
2. Login
3. Go to Orders page
4. Click on the new order
5. **Verify order items show**:
   - Product name
   - Size and color
   - Quantity
   - Price

## 🔍 Step 6: Troubleshooting Production

### Issue: Order items not showing in production

#### Check 1: Database Schema
Run in Supabase SQL Editor:
```sql
SELECT * FROM order_items LIMIT 5;
```

If empty or error, re-run `postgresql_setup.sql`

#### Check 2: Backend Logs
In Vercel backend deployment:
1. Go to Deployments
2. Click latest deployment
3. Click "View Function Logs"
4. Look for errors when creating orders

#### Check 3: API Response
In browser console (F12) on admin dashboard:
1. Go to Network tab
2. View an order
3. Find request to `/api/orders/{id}`
4. Check response - should have `items` array

#### Check 4: Environment Variables
Verify in Vercel:
- Backend has `DATABASE_URL` or `POSTGRES_URL`
- Admin dashboard has `VITE_API_URL`

### Issue: Database connection failed

**Solution**: Check Supabase credentials
1. Go to Supabase → Project Settings → Database
2. Copy connection string
3. Update `DATABASE_URL` in Vercel
4. Redeploy backend

### Issue: Admin dashboard using wrong backend

**Solution**: Check environment variable
1. Vercel → Admin Dashboard → Settings → Environment Variables
2. Verify `VITE_API_URL` is set correctly
3. Redeploy admin dashboard

## 📊 Step 7: Monitor Production

### Check Backend Health
```bash
curl https://your-backend.vercel.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2026-02-15T...",
  "database": "Connected"
}
```

### Check Recent Orders
In Supabase SQL Editor:
```sql
SELECT 
  o.order_id,
  o.order_number,
  o.total_amount,
  COUNT(oi.order_item_id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.order_number, o.total_amount
ORDER BY o.created_at DESC
LIMIT 10;
```

All orders should have `item_count > 0`

## 🎯 Success Criteria

- [ ] Code pushed to GitHub
- [ ] Supabase database setup complete
- [ ] All environment variables configured
- [ ] Backend deployed successfully
- [ ] Admin dashboard deployed successfully
- [ ] Customer website deployed successfully
- [ ] Test order created in production
- [ ] Order items visible in admin dashboard
- [ ] No errors in deployment logs

## 🔄 Rollback Plan

If something goes wrong:

### Option 1: Revert Git Commit
```bash
git revert HEAD
git push origin main
```

### Option 2: Redeploy Previous Version
In Vercel:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## 📝 Important Notes

### Local vs Production
- **Local**: Uses MySQL (XAMPP)
- **Production**: Uses PostgreSQL (Supabase)
- **Code**: Works with both (database wrapper handles differences)

### Environment Files
- `.env.local` - Local development only (not committed)
- `.env.production` - Production settings (committed)
- Vercel Environment Variables - Override everything

### Database Differences
- MySQL uses `AUTO_INCREMENT`
- PostgreSQL uses `SERIAL`
- Both handled automatically by database wrappers

## 🎉 After Successful Deployment

1. Test complete order flow in production
2. Verify email notifications work
3. Test payment verification
4. Check order status updates
5. Monitor for any errors

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Check browser console
4. Review this guide step by step

---

**Ready to Deploy?** Follow the steps above in order, and your production site will work exactly like your local setup!
