-- Quick fix: Add missing screenshot_url column to payment_verifications table
-- Run this in Supabase SQL Editor

ALTER TABLE payment_verifications 
ADD COLUMN IF NOT EXISTS screenshot_url VARCHAR(500);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payment_verifications' 
AND column_name = 'screenshot_url';

-- You should see:
-- column_name      | data_type
-- screenshot_url   | character varying
