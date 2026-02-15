# ✅ Production Deployment Checklist

## Before You Start
- [ ] Local version is working perfectly
- [ ] XAMPP MySQL shows order items correctly
- [ ] Admin dashboard displays all order details locally

## Step 1: Supabase Database Setup (10 minutes)

### 1.1 Access Supabase
- [ ] Go to https://supabase.com
- [ ] Login to your account
- [ ] Open your project (or create new one)

### 1.2 Run Database Setup
- [ ] Go to SQL Editor
- [ ] Open file: `am/admin-dashboard/database/postgresql_setup.sql`
- [ ] Copy entire content
- [ ] Paste in SQL Editor
- [ ] Click **RUN**
- [ ] Wait for "Database setup completed successfully!" message

### 1.3 Verify Tables
- [ ] Run this query:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```
- [ ] Confirm you see: `order_items` table in the list

### 1.4 Get Database Credentials
- [ ] Go to Project Settings → Database
- [ ] Copy "Connection string" (URI format)
- [ ] Save it for Step 2

### 1.5 Get Supabase API Keys
- [ ] Go to Project Settings → API
- [ ] Copy "Project URL"
- [ ] Copy "anon public" key
- [ ] Save both for Step 2

## Step 2: Configure Vercel Environment Variables (5 minutes)

### 2.1 Backend Server Environment Variables
- [ ] Go to Vercel Dashboard
- [ ] Select your backend project
- [ ] Go to Settings → Environment Variables
- [ ] Add these variables:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres
POSTGRES_URL = postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres
SUPABASE_URL = https://[PROJECT].supabase.co
SUPABASE_ANON_KEY = your_anon_key_here
EMAIL_USER = madasumiteesh@gmail.com
EMAIL_PASSWORD = mnfc xdxe ojpi rtzf
ADMIN_EMAIL = madasumiteesh@gmail.com
NODE_ENV = production
```

- [ ] Click "Save" for each variable

### 2.2 Admin Dashboard Environment Variables
- [ ] Go to Vercel Dashboard
- [ ] Select your admin dashboard project
- [ ] Go to Settings → Environment Variables
- [ ] Add this variable:

```
VITE_API_URL = https://your-backend-url.vercel.app/api
```

Replace `your-backend-url` with your actual backend URL

- [ ] Click "Save"

### 2.3 Customer Website Environment Variables
- [ ] No changes needed (already configured)

## Step 3: Push to GitHub (2 minutes)

### 3.1 Check Changes
```bash
cd am
git status
```

### 3.2 Stage All Changes
```bash
git add .
```

### 3.3 Commit
```bash
git commit -m "Fix: Order items display in admin dashboard - Production ready"
```

### 3.4 Push
```bash
git push origin main
```

- [ ] Confirm push successful
- [ ] Check GitHub to see new commit

## Step 4: Wait for Vercel Deployment (5 minutes)

### 4.1 Backend Deployment
- [ ] Go to Vercel Dashboard → Backend Project
- [ ] Wait for deployment to complete
- [ ] Check deployment status is "Ready"
- [ ] Click on deployment to view logs
- [ ] Look for: "✅ PostgreSQL Database connected successfully"

### 4.2 Admin Dashboard Deployment
- [ ] Go to Vercel Dashboard → Admin Dashboard Project
- [ ] Wait for deployment to complete
- [ ] Check deployment status is "Ready"

### 4.3 Customer Website Deployment
- [ ] Go to Vercel Dashboard → Customer Website Project
- [ ] Wait for deployment to complete
- [ ] Check deployment status is "Ready"

## Step 5: Test Production (5 minutes)

### 5.1 Test Backend Health
- [ ] Open: `https://your-backend.vercel.app/api/health`
- [ ] Should see: `{"status":"OK","database":"Connected"}`

### 5.2 Create Test Order
- [ ] Go to your customer website
- [ ] Add a product to cart
- [ ] Fill in delivery address
- [ ] Complete payment process
- [ ] Submit order
- [ ] Note the order number

### 5.3 Verify in Admin Dashboard
- [ ] Go to your admin dashboard
- [ ] Login with admin credentials
- [ ] Click "Orders" in sidebar
- [ ] Find your test order
- [ ] Click eye icon 👁️ to view details
- [ ] **VERIFY YOU SEE**:
  - ✅ Product name
  - ✅ Size and color
  - ✅ Quantity
  - ✅ Unit price
  - ✅ Subtotal

## Step 6: Verify Database (Optional)

### 6.1 Check Order Items in Supabase
- [ ] Go to Supabase → SQL Editor
- [ ] Run this query:
```sql
SELECT 
  o.order_number,
  oi.product_name,
  oi.variant_details,
  oi.quantity,
  oi.unit_price
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
ORDER BY o.created_at DESC
LIMIT 5;
```
- [ ] Confirm you see your test order with items

## 🎉 Success Criteria

All these should be TRUE:
- [ ] Backend deployed without errors
- [ ] Admin dashboard deployed without errors
- [ ] Customer website deployed without errors
- [ ] Backend health check returns OK
- [ ] Test order created successfully
- [ ] Order items visible in admin dashboard
- [ ] Order items show product name, size, color, quantity, price

## ⚠️ If Something Goes Wrong

### Backend won't connect to database
1. Check Supabase credentials in Vercel
2. Verify DATABASE_URL format is correct
3. Check Supabase project is active
4. Redeploy backend in Vercel

### Admin dashboard shows "No items found"
1. Check VITE_API_URL in Vercel admin dashboard settings
2. Verify it points to correct backend URL
3. Redeploy admin dashboard
4. Clear browser cache and reload

### Order items not saving
1. Check backend deployment logs for errors
2. Verify postgresql_setup.sql was run completely
3. Check order_items table exists in Supabase
4. Test with a new order

### Can't login to admin dashboard
1. Check if admin user was created in Supabase
2. Run the INSERT admin query again
3. Verify email matches what you're using to login

## 📞 Quick Help

### View Backend Logs
Vercel → Backend Project → Deployments → Latest → View Function Logs

### View Database Tables
Supabase → Table Editor → Select table from dropdown

### Test API Directly
```bash
curl https://your-backend.vercel.app/api/orders
```

## 🔄 After Deployment

- [ ] Test complete order flow
- [ ] Verify payment verification works
- [ ] Test order status updates
- [ ] Check email notifications
- [ ] Monitor for any errors

## 📝 Important URLs to Save

```
Backend: https://your-backend.vercel.app
Admin Dashboard: https://your-admin.vercel.app
Customer Website: https://your-website.vercel.app
Supabase: https://app.supabase.com/project/[your-project]
```

---

**Estimated Total Time**: 30 minutes

**Difficulty**: Easy (just follow the steps)

**Result**: Production site works exactly like local setup!
