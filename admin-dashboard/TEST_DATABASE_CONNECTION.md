# 🧪 Test Database Connection

## Quick Test Commands

### Test 1: Check Server Logs

Start your backend server and look for these messages:

```bash
cd am/admin-dashboard/server
npm start
```

**✅ Success looks like:**
```
🗄️  Using PostgreSQL database
✅ Database connected successfully
✅ Supabase Storage initialized
🚀 Server running on port 5000
```

**❌ Failure looks like:**
```
🗄️  Using MySQL database  ← WRONG! Should be PostgreSQL
```
or
```
❌ Database connection failed
Error: connect ECONNREFUSED
```

---

### Test 2: Check Orders API

Open your browser or use curl:

**Browser:**
```
http://localhost:5000/api/orders
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "order_id": 1,
      "order_number": "ORD-1234567890-123",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "total_amount": "999.00",
      "order_status": "pending",
      "item_count": 2,
      ...
    }
  ]
}
```

**If you see empty array:**
```json
{
  "success": true,
  "data": []
}
```
→ No orders in database yet (this is OK if you haven't placed any orders)

**If you see error:**
```json
{
  "success": false,
  "message": "Database connection failed"
}
```
→ Check your DATABASE_URL in .env file

---

### Test 3: Check Order Details

Pick an order_id from the previous test and check:

**Browser:**
```
http://localhost:5000/api/orders/1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "order_number": "ORD-1234567890-123",
    "customer_name": "John Doe",
    "items": [
      {
        "order_item_id": 1,
        "product_name": "Premium T-Shirt",
        "variant_details": "Size: M, Color: Black",
        "quantity": 2,
        "unit_price": "499.00",
        "subtotal": "998.00"
      }
    ],
    ...
  }
}
```

**✅ Good Signs:**
- `items` array has data
- Each item has `product_name`, `variant_details`, `quantity`, `unit_price`

**❌ Bad Signs:**
- `items` array is empty: `"items": []`
- No `items` field at all

---

### Test 4: Admin Dashboard Visual Test

1. **Open Admin Dashboard:**
   ```
   http://localhost:3000
   ```

2. **Login** with your credentials

3. **Go to Orders page**

**✅ Success:**
- Orders list shows orders
- Each order shows customer name, email, phone
- Item count is correct (e.g., "2 items")
- Total amount displays correctly

4. **Click "View" on any order**

**✅ Success:**
- Modal opens
- Order details section shows customer info
- **📦 Order Items section shows:**
  - Product names
  - Variant details (size, color)
  - Quantities
  - Unit prices
  - Subtotals
- Order summary shows totals
- Shipping address displays

**❌ Failure:**
- "⚠️ No items found for this order" message
- Empty items section
- Modal doesn't open

---

## 🔍 Troubleshooting Guide

### Issue: "Using MySQL database" in logs

**Problem:** Server is using local MySQL instead of Supabase PostgreSQL

**Fix:**
1. Check `am/admin-dashboard/server/.env` has `DATABASE_URL` set
2. Make sure DATABASE_URL starts with `postgresql://`
3. Restart the server

**Verify:**
```bash
# Check .env file
cat am/admin-dashboard/server/.env | grep DATABASE_URL

# Should output:
# DATABASE_URL=postgresql://postgres...
```

---

### Issue: "Database connection failed"

**Problem:** Can't connect to Supabase

**Fix:**
1. Check DATABASE_URL has correct password
2. Check internet connection
3. Verify Supabase project is active

**Test connection manually:**
```bash
# Install psql if needed, then:
psql "postgresql://postgres.xxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres"
```

---

### Issue: Orders show but items are empty

**Problem:** `order_items` table is empty or not linked correctly

**Fix:**
1. Check if orders were created properly
2. Verify order_items table exists in Supabase

**Check in Supabase Dashboard:**
1. Go to Table Editor
2. Click `order_items` table
3. Check if there's data

**If table is empty:**
- Place a new test order from your website
- Check if items get inserted

---

### Issue: "Supabase credentials not configured"

**Problem:** Missing SUPABASE_URL or SUPABASE_ANON_KEY

**Fix:**
Add to `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Issue: Customer names show as "null null"

**Problem:** customers table is empty or not linked

**Fix:**
1. Check if customer_id in orders table is valid
2. Verify customers table has data
3. Check foreign key relationship

**SQL to check:**
```sql
SELECT o.order_id, o.customer_id, c.first_name, c.last_name
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
LIMIT 5;
```

Run this in Supabase Dashboard → SQL Editor

---

## 📊 Database Health Check

### Check Tables Exist

In Supabase Dashboard → SQL Editor, run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables:**
- customers
- orders
- order_items
- products
- payment_verifications
- payments
- coupons
- admin_users
- login_requests

---

### Check Order Items Count

```sql
SELECT 
  o.order_id,
  o.order_number,
  COUNT(oi.order_item_id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.order_number
ORDER BY o.created_at DESC
LIMIT 10;
```

**Expected:**
- Each order should have item_count > 0
- If item_count = 0, that order has no items (problem!)

---

### Check Sample Order with Items

```sql
SELECT 
  o.order_id,
  o.order_number,
  oi.product_name,
  oi.variant_details,
  oi.quantity,
  oi.unit_price
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
LIMIT 5;
```

**Expected:**
- Should return rows with product names and details
- If empty, no orders have items yet

---

## ✅ Success Checklist

After all tests pass:

- [ ] Server logs show "Using PostgreSQL database"
- [ ] Server logs show "Database connected successfully"
- [ ] Server logs show "Supabase Storage initialized"
- [ ] `/api/orders` returns orders array
- [ ] `/api/orders/:id` returns order with items array
- [ ] Admin dashboard Orders page displays orders
- [ ] Order details modal opens
- [ ] Order items display in modal with all details
- [ ] Customer information displays correctly
- [ ] Payment status shows correctly
- [ ] Order status can be updated

---

## 🎯 Final Verification

**Place a test order:**

1. Go to your website: http://localhost:3001 (or your frontend URL)
2. Add a product to cart
3. Go to checkout
4. Fill in customer details
5. Place order

**Check in admin dashboard:**

1. Refresh Orders page
2. New order should appear at the top
3. Click "View" on the new order
4. Verify all items display correctly
5. Check customer details are correct

**If everything works:** ✅ You're all set!

**If something fails:** Check the specific troubleshooting section above

---

## 🆘 Still Having Issues?

1. **Check server logs** for specific error messages
2. **Check browser console** (F12) for frontend errors
3. **Check Supabase logs** in Dashboard → Logs
4. **Verify .env file** has all required variables
5. **Restart everything:**
   ```bash
   # Stop all servers
   # Then restart:
   cd am/admin-dashboard/server
   npm start
   
   # In another terminal:
   cd am/admin-dashboard/client
   npm start
   ```

---

**Good luck! 🚀**
