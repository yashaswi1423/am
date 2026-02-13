-- Add screenshot_url column to payment_verifications table (PostgreSQL)
-- This stores the public Supabase Storage URL for the payment screenshot

ALTER TABLE payment_verifications 
ADD COLUMN IF NOT EXISTS screenshot_url VARCHAR(500);

-- Add comment to column
COMMENT ON COLUMN payment_verifications.screenshot_url IS 'Public Supabase Storage URL for payment screenshot';
