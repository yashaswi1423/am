-- ============================================
-- ADD MISSING PRODUCT_IMAGES TABLE
-- Run this in your Supabase SQL Editor
-- ============================================

-- Product Images Table (for multiple images per product)
CREATE TABLE IF NOT EXISTS product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON product_images(display_order);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);

-- Add trigger for auto-updating updated_at
CREATE TRIGGER update_product_images_updated_at 
BEFORE UPDATE ON product_images 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created
SELECT 'product_images table created successfully!' AS status;
SELECT COUNT(*) AS image_count FROM product_images;
