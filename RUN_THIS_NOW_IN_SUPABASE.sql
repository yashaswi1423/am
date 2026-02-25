-- ============================================
-- RUN THIS IN SUPABASE SQL EDITOR RIGHT NOW
-- ============================================
-- This will make your product images visible immediately
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query
-- Copy this entire file and click RUN

-- Step 1: Make the bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'product-images';

-- Step 2: Drop existing policy if it exists (to avoid conflict)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;

-- Step 3: Create new policy to allow public read access
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Step 4: Verify it worked
SELECT id, name, public FROM storage.buckets WHERE id = 'product-images';

-- Expected result: public should be TRUE

-- ============================================
-- AFTER RUNNING THIS:
-- 1. Refresh your customer website
-- 2. Images will load immediately
-- 3. No need to re-upload anything
-- ============================================
