-- Add screenshot_url column to payment_verifications table
-- This stores the public Supabase Storage URL for the payment screenshot

ALTER TABLE payment_verifications 
ADD COLUMN screenshot_url VARCHAR(500) AFTER screenshot_filename;

-- Update existing records (if any) - set to NULL for now
-- Admin will need to re-upload or you can manually update these
UPDATE payment_verifications 
SET screenshot_url = NULL 
WHERE screenshot_url IS NULL;
