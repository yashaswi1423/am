-- Add bulk pricing table for "3 for ₹1000" type offers
-- This allows products to have quantity-based pricing

CREATE TABLE IF NOT EXISTS bulk_pricing (
  bulk_pricing_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  display_text VARCHAR(100), -- e.g., "3 for ₹1000"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, min_quantity)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_bulk_pricing_product ON bulk_pricing(product_id);
CREATE INDEX IF NOT EXISTS idx_bulk_pricing_active ON bulk_pricing(is_active);

-- Sample data
-- Example: Product with ID 1 has bulk pricing
-- 1 piece = base price (from products table)
-- 3 pieces = ₹1000 (₹333.33 per piece)
-- 5 pieces = ₹1500 (₹300 per piece)

-- INSERT INTO bulk_pricing (product_id, min_quantity, price_per_unit, display_text) 
-- VALUES 
--   (1, 3, 333.33, '3 for ₹1000'),
--   (1, 5, 300.00, '5 for ₹1500');

COMMENT ON TABLE bulk_pricing IS 'Stores quantity-based pricing for products (e.g., 3 for ₹1000)';
COMMENT ON COLUMN bulk_pricing.min_quantity IS 'Minimum quantity required for this pricing tier';
COMMENT ON COLUMN bulk_pricing.price_per_unit IS 'Price per unit when buying this quantity';
COMMENT ON COLUMN bulk_pricing.display_text IS 'Text to display to customers (e.g., "3 for ₹1000")';
