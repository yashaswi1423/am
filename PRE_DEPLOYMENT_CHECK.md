# ✅ Pre-Deployment Check

Run through this checklist before deploying to production.

## 🔍 Local Environment Check

### 1. Database Connection
```bash
cd am/admin-dashboard/server
node test-orders.js
```

**Expected Output:**
```
✅ MySQL Database connected successfully
Found X orders:
Order ID: X
  📦 Order Items (X):
  1. Product Name
     Details: Size: X, Color: X
     Quantity: X
```

✅ **Pass**: Shows orders with items  
❌ **Fail**: No items or connection error → Fix local setup first

### 2. Backend Server
```bash
# Check if running
curl http://localhost:5000/api/health
```

**Expected Output:**
```json
{"status":"OK","database":"Connected"}
```

✅ **Pass**: Returns OK status  
❌ **Fail**: Connection refused → Start backend server

### 3. Admin Dashboard
```
Open: http://localhost:3001
Login → Orders → View any order
```

**Expected:**
- ✅ Order items section shows products
- ✅ Product name visible
- ✅ Size and color visible
- ✅ Quantity and price visible

❌ **Fail**: "No items found" → Check `.env.local` file exists

## 📁 Files Check

### Required Files Exist
- [ ] `am/admin-dashboard/server/config/database-mysql.js` (modified)
- [ ] `am/admin-dashboard/server/config/database-postgres.js` (exists)
- [ ] `am/admin-dashboard/client/src/services/api.js` (modified)
- [ ] `am/admin-dashboard/client/.env.local` (created)
- [ ] `am/admin-dashboard/client/.env.production` (exists)
- [ ] `am/admin-dashboard/database/postgresql_setup.sql` (exists)

### Check File Contents

#### 1. Check api.js uses environment variable
```bash
cd am/admin-dashboard/client/src/services
grep "import.meta.env.VITE_API_URL" api.js
```

Should return a line with `import.meta.env.VITE_API_URL`

✅ **Pass**: Found  
❌ **Fail**: Not found → File not updated correctly

#### 2. Check .env.local exists
```bash
cd am/admin-dashboard/client
cat .env.local
```

Should show:
```
VITE_API_URL=http://localhost:5000/api
```

✅ **Pass**: File exists with correct content  
❌ **Fail**: File missing → Create it

#### 3. Check .env.production
```bash
cd am/admin-dashboard/client
cat .env.production
```

Should show:
```
VITE_API_URL=https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api
```

✅ **Pass**: File exists  
❌ **Fail**: Update with your backend URL

## 🗄️ Database Schema Check

### Check order_items table structure
```bash
cd am/admin-dashboard/server
```

Create a test file `check-schema.js`:
```javascript
import db from './config/database.js';

async function checkSchema() {
  try {
    const result = await db.query('DESCRIBE order_items');
    console.log('order_items table structure:');
    console.table(result[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
```

Run:
```bash
node check-schema.js
```

**Expected columns:**
- order_item_id
- order_id
- product_id
- variant_id
- product_name
- variant_details
- quantity
- unit_price
- subtotal
- created_at

✅ **Pass**: All columns present  
❌ **Fail**: Missing columns → Re-run database setup

## 🔐 Credentials Check

### 1. Supabase Credentials Ready
- [ ] Supabase account created
- [ ] Project created
- [ ] Database connection string copied
- [ ] Project URL copied
- [ ] Anon key copied

### 2. Vercel Access
- [ ] Can access Vercel dashboard
- [ ] Can see backend project
- [ ] Can see admin dashboard project
- [ ] Can see customer website project

### 3. Email Credentials
- [ ] Email user: madasumiteesh@gmail.com
- [ ] Email password: mnfc xdxe ojpi rtzf
- [ ] Admin email: madasumiteesh@gmail.com

## 📝 Git Status Check

```bash
cd am
git status
```

**Expected:**
```
Modified:
  admin-dashboard/server/config/database-mysql.js
  admin-dashboard/client/src/services/api.js

Untracked:
  admin-dashboard/client/.env.local
  admin-dashboard/server/test-orders.js
  FIX_ORDER_ITEMS_ISSUE.md
  TEST_ORDER_ITEMS_LOCALLY.md
  ORDER_ITEMS_FIXED.md
  QUICK_START_LOCAL.md
  DEPLOY_TO_PRODUCTION.md
  PRODUCTION_DEPLOYMENT_CHECKLIST.md
  DEPLOY_NOW_SIMPLE.md
  PRE_DEPLOYMENT_CHECK.md
```

✅ **Pass**: Shows modified and new files  
❌ **Fail**: No changes → Something went wrong

## 🧪 Final Local Test

### Complete Order Flow Test
1. [ ] Open http://localhost:3000
2. [ ] Add product to cart
3. [ ] Complete checkout with address
4. [ ] Submit payment details
5. [ ] Order created successfully
6. [ ] Open http://localhost:3001
7. [ ] Login to admin dashboard
8. [ ] Go to Orders page
9. [ ] Find the new order
10. [ ] Click view details
11. [ ] **Verify order items show correctly**

✅ **Pass**: All steps work, items visible  
❌ **Fail**: Any step fails → Fix before deploying

## 📊 Summary

### All Checks Passed?
- [ ] Local database test passes
- [ ] Backend health check passes
- [ ] Admin dashboard shows order items
- [ ] All required files exist
- [ ] File contents are correct
- [ ] Database schema is correct
- [ ] Credentials are ready
- [ ] Git shows changes
- [ ] Complete order flow works

### Ready to Deploy?

✅ **YES** - All checks passed → Proceed to `DEPLOY_NOW_SIMPLE.md`

❌ **NO** - Some checks failed → Fix issues first

## 🔧 Quick Fixes

### If local test fails:
1. Restart all servers
2. Clear browser cache
3. Check XAMPP MySQL is running
4. Re-run test-orders.js

### If files are missing:
1. Check you're in the correct directory
2. Re-run the fixes from earlier
3. Verify git status shows changes

### If database schema is wrong:
1. Open phpMyAdmin
2. Drop ecommerce_admin database
3. Re-run mysql_complete_setup.sql

---

## 🚀 Next Steps

Once all checks pass:

1. **Read**: `DEPLOY_NOW_SIMPLE.md` (quick guide)
2. **Or**: `PRODUCTION_DEPLOYMENT_CHECKLIST.md` (detailed)
3. **Deploy**: Follow the steps
4. **Verify**: Test in production

---

**Estimated Time**: 5 minutes to run all checks

**If all pass**: You're ready to deploy! 🎉
