-- Add minimum bulk order amount setting
-- This is the amount that will be charged for bulk orders (products with price = 0)

INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES
('minimum_bulk_order_amount', '1000', 'Minimum amount to charge for bulk orders (products with price = 0)', 'admin')
ON CONFLICT (setting_key) 
DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

COMMENT ON TABLE system_settings IS 'System-wide settings including maintenance mode and bulk order pricing';
