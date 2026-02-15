# 🔍 DIAGNOSE: Why Order Items Are Not Showing

## Current Situation

Admin can see:
- ✅ Orders in the orders list
- ✅ Order details (customer, date, status, payment)
- ❌ Order items (shows "No items found for this order")

## Step 1: Check Database in Supabase

### Go to Supabase SQL Editor and run this:

```sql
-- Check if order_items table has any data
SELECT COUNT(*) as total_order_items FROM order_items;
```

### Expected Results:

**If result is 0:**
- Problem: Order items are NOT being inserted into database
- Solution: Backend code issue with INSERT statement

**If result is > 0:**
- Problem: Frontend is not fetching items correctly
- Solution: API endpoint or frontend code issue

---

## Step 2: Check Specific Order

Run this to check the order from your screenshot:

```sql
SELECT 
    o.order_id,
    o.order_number,
    o.total_amount,
    oi.order_item_id,
    oi.product_name,
    oi.quantity,
    oi.unit_price
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_number = 'ORD-1771147269070-801';
```

### Expected Results:

**If order_item_id is NULL:**
- No items were inserted for this order
- Need to fix the order creation process

**If order_item_id has values:**
- Items exist but frontend can't fetch them
- Need to check API endpoint

---

## Step 3: Check Recent Orders

```sql
SELECT 
    o.order_id,
    o.order_number,
    o.created_at,
    COUNT(oi.order_item_id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.order_number, o.created_at
ORDER BY o.created_at DESC
LIMIT 10;
```

This shows how many items each order has.

---

## Step 4: Place a NEW Test Order

1. Go to your website
2. Add an item to cart
3. Complete checkout
4. Note the order number
5. Run this SQL (replace ORDER_NUMBER):

```sql
SELECT 
    o.order_id,
    o.order_number,
    oi.*
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_number = 'YOUR_ORDER_NUMBER_HERE';
```

---

## What to Tell Me

After running the queries above, tell me:

1. **Total order_items count**: (number from Step 1)
2. **Does the specific order have items?**: (yes/no from Step 2)
3. **Do recent orders have items?**: (yes/no from Step 3)
4. **Does a NEW test order have items?**: (yes/no from Step 4)

Based on your answers, I'll know exactly where the problem is and how to fix it!

---

## Quick Reference

**All queries in one file**: `CHECK_ORDER_ITEMS.sql`

Just copy and paste each query into Supabase SQL Editor and run them one by one.
