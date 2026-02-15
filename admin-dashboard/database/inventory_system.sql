-- ============================================
-- INVENTORY MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  image_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Product Variants Table (Colors & Sizes)
CREATE TABLE IF NOT EXISTS product_variants (
  variant_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  color VARCHAR(50),
  size VARCHAR(20),
  sku VARCHAR(100) UNIQUE,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Update Order Items Table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS variant_id INTEGER REFERENCES product_variants(variant_id),
ADD COLUMN IF NOT EXISTS product_image_url TEXT;

-- 5. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

-- 6. Create Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_variants_updated_at ON product_variants;
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Create Supabase Storage Bucket (Run in Supabase Dashboard)
-- Go to Storage → Create bucket → Name: "product-images" → Public: Yes

-- 8. Storage Policies (Run after creating bucket)
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated uploads
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- Allow authenticated deletes
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' );

-- 9. Sample Data (Optional - for testing)
INSERT INTO products (name, description, category, base_price) VALUES
('Classic White Tee', 'Premium cotton t-shirt', 'T-Shirts', 299.00),
('Black Essential Tee', 'Comfortable everyday tee', 'T-Shirts', 299.00),
('Grey Minimal Tee', 'Minimalist design t-shirt', 'T-Shirts', 349.00)
ON CONFLICT DO NOTHING;

-- Add variants for products
INSERT INTO product_variants (product_id, color, size, sku, stock_quantity) VALUES
(1, 'White', 'S', 'CWT-W-S', 50),
(1, 'White', 'M', 'CWT-W-M', 100),
(1, 'White', 'L', 'CWT-W-L', 75),
(1, 'White', 'XL', 'CWT-W-XL', 50),
(2, 'Black', 'S', 'BET-B-S', 40),
(2, 'Black', 'M', 'BET-B-M', 80),
(2, 'Black', 'L', 'BET-B-L', 60),
(2, 'Black', 'XL', 'BET-B-XL', 40)
ON CONFLICT (sku) DO NOTHING;

-- Verify tables created
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Product Images', COUNT(*) FROM product_images
UNION ALL
SELECT 'Product Variants', COUNT(*) FROM product_variants;
