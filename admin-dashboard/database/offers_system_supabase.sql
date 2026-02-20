-- ============================================
-- OFFERS SYSTEM - SUPABASE DATABASE SCHEMA
-- ============================================

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
    offer_id BIGSERIAL PRIMARY KEY,
    offer_name VARCHAR(255) NOT NULL,
    description TEXT,
    original_price DECIMAL(10, 2) NOT NULL,
    offer_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        ROUND(((original_price - offer_price) / original_price * 100)::numeric, 2)
    ) STORED,
    stock_quantity INT NOT NULL DEFAULT 0,
    category VARCHAR(100) DEFAULT 'Special Offers',
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create offer_images table for multiple images per offer
CREATE TABLE IF NOT EXISTS offer_images (
    image_id BIGSERIAL PRIMARY KEY,
    offer_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (offer_id) REFERENCES offers(offer_id) ON DELETE CASCADE
);

-- Create offer_variants table for size/color options
CREATE TABLE IF NOT EXISTS offer_variants (
    variant_id BIGSERIAL PRIMARY KEY,
    offer_id BIGINT NOT NULL,
    size VARCHAR(20),
    color VARCHAR(50),
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (offer_id) REFERENCES offers(offer_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(is_active);
CREATE INDEX IF NOT EXISTS idx_offers_featured ON offers(is_featured);
CREATE INDEX IF NOT EXISTS idx_offers_validity ON offers(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_offer_images_offer_id ON offer_images(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_variants_offer_id ON offer_variants(offer_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_offers_timestamp ON offers;
CREATE TRIGGER trigger_update_offers_timestamp
    BEFORE UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION update_offers_updated_at();

DROP TRIGGER IF EXISTS trigger_update_offer_variants_timestamp ON offer_variants;
CREATE TRIGGER trigger_update_offer_variants_timestamp
    BEFORE UPDATE ON offer_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_offers_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for customer-facing website)
CREATE POLICY "Allow public read access to active offers" ON offers
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow public read access to offer images" ON offer_images
    FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to offer variants" ON offer_variants
    FOR SELECT
    USING (true);

-- Create policies for authenticated admin access (full CRUD)
-- Note: You'll need to adjust these based on your auth setup
CREATE POLICY "Allow authenticated users full access to offers" ON offers
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to offer images" ON offer_images
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to offer variants" ON offer_variants
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Insert sample offers (optional - you can delete these later)
INSERT INTO offers (offer_name, description, original_price, offer_price, stock_quantity, image_url, is_featured) VALUES
('Winter Special Combo', 'Premium winter collection with exclusive discount', 1600.00, 999.00, 50, '/WhatsApp Image 2026-02-04 at 8.58.32 AM.jpeg', TRUE),
('Summer Sale Bundle', 'Best summer collection at unbeatable prices', 1800.00, 1199.00, 30, '/WhatsApp Image 2026-02-04 at 8.58.32 AM (1).jpeg', TRUE),
('Festive Offer Pack', 'Celebrate with our special festive collection', 2000.00, 1299.00, 40, '/WhatsApp Image 2026-02-04 at 8.58.33 AM.jpeg', TRUE)
ON CONFLICT DO NOTHING;

-- Add comments
COMMENT ON TABLE offers IS 'Stores special offer products with discounted pricing';
COMMENT ON TABLE offer_images IS 'Multiple images for each offer product';
COMMENT ON TABLE offer_variants IS 'Size and color variants for offer products';

-- Grant permissions (if needed)
-- GRANT ALL ON offers TO authenticated;
-- GRANT ALL ON offer_images TO authenticated;
-- GRANT ALL ON offer_variants TO authenticated;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
