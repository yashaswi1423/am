# 🎯 RUN THIS IN SUPABASE SQL EDITOR

## Instructions

1. Go to: **https://app.supabase.com**
2. Open project: **ghekzhxusoijeolsjnlo**
3. Click: **SQL Editor** → **New Query**
4. Copy and paste the queries below ONE BY ONE
5. Click **RUN** after each query
6. Tell me the results

---

## Query 1: Check if ANY order items exist

```sql
SELECT COUNT(*) as total_order_items FROM order_items;
```

**Tell me the number you see!**

---

## Query 2: Check the specific order from screenshot

```sql
SELECT 
    o.order_id,
    o.order_number,
    oi.order_item_id,
    oi.product_name,
    oi.quantity,
    oi.unit_price
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_number = 'ORD-1771147269070-801';
```

**Tell me if you see any product_name or if it's empty!**

---

## Query 3: Check ALL recent orders

```sql
SELECT 
    o.order_number,
    o.created_at,
    COUNT(oi.order_item_id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.order_number, o.created_at
ORDER BY o.created_at DESC
LIMIT 10;
```

**Tell me if item_count is 0 or greater than 0!**

---

## What This Tells Us

- **If Query 1 = 0**: No items in database at all → Backend not inserting items
- **If Query 1 > 0**: Items exist → Frontend not fetching them correctly
- **Query 2**: Shows if that specific order has items
- **Query 3**: Shows if ANY orders have items

---

## After Running These

Tell me the results and I'll know exactly how to fix it!
