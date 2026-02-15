-- Run this in Supabase SQL Editor to check if order items exist

-- 1. Check how many orders exist
SELECT COUNT(*) as total_orders FROM orders;

-- 2. Check how many order_items exist
SELECT COUNT(*) as total_order_items FROM order_items;

-- 3. Check recent orders with their items
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

-- 4. Check if any order_items exist at all
SELECT * FROM order_items LIMIT 5;

-- 5. Check the specific order from the screenshot
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
