-- Fix all existing variants that are disabled or have zero stock
-- This will enable all variants and set a default stock quantity

-- Step 1: Enable all variants (set is_available = true)
UPDATE product_variants 
SET is_available = true 
WHERE is_available = false OR is_available IS NULL;

-- Step 2: Set default stock for variants with zero or null stock
-- You can change the default stock quantity (10) to whatever you prefer
UPDATE product_variants 
SET stock_quantity = 10 
WHERE stock_quantity = 0 OR stock_quantity IS NULL;

-- Step 3: Verify the changes
SELECT 
    pv.variant_id,
    p.product_name,
    pv.color,
    pv.size,
    pv.stock_quantity,
    pv.is_available,
    pv.price_adjustment
FROM product_variants pv
JOIN products p ON pv.product_id = p.product_id
ORDER BY p.product_name, pv.color, pv.size;

-- Summary of changes
SELECT 
    COUNT(*) as total_variants,
    SUM(CASE WHEN is_available = true THEN 1 ELSE 0 END) as available_variants,
    SUM(CASE WHEN stock_quantity > 0 THEN 1 ELSE 0 END) as variants_with_stock,
    SUM(stock_quantity) as total_stock
FROM product_variants;
