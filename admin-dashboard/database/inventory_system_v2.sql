-- ============================================
-- INVENTORY MANAGEMENT SYSTEM V2 - COMPATIBLE WITH EXISTING SCHEMA
-- This version works with your existing products table structure
-- ============================================

-- 1. Add missing columns to existing products table
DO $$ 
BEGIN
    -- The products table already exists with product_name, so we'll work with that
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='products' AND column_name='is_active') THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 2. Product Images Table (for multiple images per product)
CREATE TABLE IF NOT EXISTS product_images (
  image_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Update Product Variants Table - ensure it has all needed columns
DO $$ 
BEGIN
    -- Add price_adjustment if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='product_variants' AND column_name='price_adjustment') THEN
        ALTER TABLE product_variants ADD COLUMN price_adjustment DECIMAL(10, 2) DEFAULT 0;
    END IF;
    
    -- Add is_available if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='product_variants' AND column_name='is_available') THEN
        ALTER TABLE product_variants ADD COLUMN is_available BOOLEAN DEFAULT true;
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='product_variants' AND column_name='updated_at') THEN
        ALTER TABLE product_variants ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- 4. Update Order Items Table - Add columns for product images
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='order_items' AND column_name='product_image_url') THEN
        ALTER TABLE order_items ADD COLUMN product_image_url TEXT;
    END IF;
END $$;

-- 5. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(is_available);

-- 6. Create/Update Trigger Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_variants_updated_at ON product_variants;

-- Create triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Show current table structure
SELECT 
    'products' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Show product_variants structure
SELECT 
    'product_variants' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'product_variants'
ORDER BY ordinal_position;

-- Show counts
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Product Images', COUNT(*) FROM product_images
UNION ALL
SELECT 'Product Variants', COUNT(*) FROM product_variants;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE '✅ Inventory system updated successfully!';
    RAISE NOTICE '✅ Tables are now compatible with existing schema';
    RAISE NOTICE '✅ Next step: Create storage bucket named "product-images" (public) in Supabase';
    RAISE NOTICE '✅ Then update backend controller to use "product_name" instead of "name"';
END $$;
