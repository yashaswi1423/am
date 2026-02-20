-- ============================================
-- CATEGORIES AND MAINTENANCE MODE - SUPABASE SCHEMA
-- ============================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create system_settings table for maintenance mode and other settings
CREATE TABLE IF NOT EXISTS system_settings (
    setting_id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);

-- Create trigger for categories updated_at
CREATE OR REPLACE FUNCTION update_categories_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_categories_timestamp ON categories;
CREATE TRIGGER trigger_update_categories_timestamp
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_categories_timestamp();

-- Create trigger for system_settings updated_at
CREATE OR REPLACE FUNCTION update_system_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_system_settings_timestamp ON system_settings;
CREATE TRIGGER trigger_update_system_settings_timestamp
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_system_settings_timestamp();

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Policies for categories (public read, authenticated write)
CREATE POLICY "Allow public read access to active categories" ON categories
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to categories" ON categories
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policies for system_settings (public read for maintenance mode, authenticated write)
CREATE POLICY "Allow public read access to system settings" ON system_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users full access to system settings" ON system_settings
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Insert default categories (existing ones from your app)
INSERT INTO categories (category_name, display_order, is_active) VALUES
('T-Shirts', 1, TRUE),
('Shirts', 2, TRUE),
('Cargo', 3, TRUE),
('Shorts', 4, TRUE),
('Track pants', 5, TRUE),
('Coats', 6, TRUE),
('Wallets', 7, TRUE),
('Jackets', 8, TRUE),
('Trousers', 9, TRUE),
('Night wear', 10, TRUE),
('Hoodies', 11, TRUE),
('Gym wear', 12, TRUE),
('Sleepwear sets', 13, TRUE),
('Sweatshirts', 14, TRUE),
('Jeans', 15, TRUE)
ON CONFLICT (category_name) DO NOTHING;

-- Insert maintenance mode setting (default: OFF)
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('maintenance_mode', 'false', 'Enable/disable maintenance mode for the website'),
('maintenance_message', 'We are currently updating our inventory. Please check back soon!', 'Message to display during maintenance mode')
ON CONFLICT (setting_key) DO NOTHING;

-- Comments
COMMENT ON TABLE categories IS 'Product categories that can be managed by admin';
COMMENT ON TABLE system_settings IS 'System-wide settings including maintenance mode';
