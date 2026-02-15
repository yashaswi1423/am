# 🗄️ Database Migration Instructions

## Quick Steps

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New query"
5. Copy the SQL from the file below
6. Paste it into the SQL Editor
7. Click "Run" (or press Ctrl+Enter)

## Which SQL File to Use

Use this file: `am/admin-dashboard/database/inventory_system_fixed.sql`

## What This Migration Does

Creates 3 new tables:

### 1. products
- Stores main product information
- Fields: product_id, product_name, description, category, base_price, is_active
- Auto-generates timestamps

### 2. product_images
- Stores multiple images per product
- Fields: image_id, product_id, image_url, display_order, is_primary
- Linked to products table (cascade delete)

### 3. product_variants
- Stores color/size variations with stock
- Fields: variant_id, product_id, color, size, sku, price_adjustment, stock_quantity, is_available
- Linked to products table (cascade delete)

## After Running Migration

You should see success messages like:
```
Success. No rows returned
```

This is normal! It means the tables were created successfully.

## Verify Tables Were Created

Run this query to check:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'product_images', 'product_variants');
```

You should see all 3 tables listed.

## If You Get Errors

### "relation already exists"
This means the tables are already created. You can either:
- Skip the migration (tables already exist)
- Or drop the tables first:
```sql
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
```
Then run the migration again.

### "permission denied"
Make sure you're using the correct Supabase project and have admin access.

## Next: Create Storage Bucket

After running the SQL migration:
1. Click "Storage" in Supabase sidebar
2. Click "Create a new bucket"
3. Name: `product-images`
4. Make it PUBLIC (toggle the switch)
5. Click "Create bucket"

## Then You're Ready!

Start testing the inventory system:
```bash
# Terminal 1
cd am/admin-dashboard/server
npm start

# Terminal 2
cd am/admin-dashboard/client
npm run dev
```

Open http://localhost:5173 and login to admin dashboard!
