# Fix Existing Variants - Quick Guide

## Problem
All previously added variants are showing as disabled because they have:
- `is_available = false` 
- `stock_quantity = 0`

## Solution
Run the SQL script to enable all variants and set default stock.

## Steps

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `am/admin-dashboard/database/fix_existing_variants.sql`
5. Click "Run" button
6. Check the results to verify all variants are now enabled

### Option 2: Using psql Command Line
```bash
psql -h your-supabase-host -U postgres -d postgres -f am/admin-dashboard/database/fix_existing_variants.sql
```

### Option 3: Custom Stock Quantities
If you want different stock quantities for different products, modify the script:

```sql
-- Set specific stock for specific products
UPDATE product_variants 
SET stock_quantity = 50, is_available = true
WHERE product_id IN (SELECT product_id FROM products WHERE category = 'T-Shirts');

UPDATE product_variants 
SET stock_quantity = 30, is_available = true
WHERE product_id IN (SELECT product_id FROM products WHERE category = 'Shirts');

-- Or set by color/size
UPDATE product_variants 
SET stock_quantity = 100, is_available = true
WHERE size IN ('M', 'L', 'XL');
```

## What the Script Does

1. **Enables all variants**: Sets `is_available = true` for all disabled variants
2. **Sets default stock**: Sets `stock_quantity = 10` for variants with 0 or null stock
3. **Shows verification**: Displays all variants with their new status
4. **Shows summary**: Displays total counts and stock levels

## After Running

1. Refresh your admin dashboard
2. Go to Inventory page
3. All variants should now show as available
4. You can edit individual stock quantities as needed

## Default Stock Quantity

The script sets a default of **10 units** per variant. To change this:
- Edit line 10 in `fix_existing_variants.sql`
- Change `SET stock_quantity = 10` to your preferred number
- Run the script again

## Verify Changes

After running the script, you should see:
- All variants with `is_available = true`
- All variants with `stock_quantity >= 10` (or your chosen default)
- Products showing as available in the inventory page
