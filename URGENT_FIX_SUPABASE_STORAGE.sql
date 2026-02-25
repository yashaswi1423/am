-- URGENT FIX: Make Supabase Storage Buckets Public
-- Run this in your Supabase SQL Editor immediately

-- This will allow public read access to product and offer images
-- Images are already uploaded, they just need to be accessible

-- 1. Make product-images bucket public
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) 
DO UPDATE SET public = true;

-- 2. Make offer-images bucket public  
INSERT INTO storage.buckets (id, name, public)
VALUES ('offer-images', 'offer-images', true)
ON CONFLICT (id)
DO UPDATE SET public = true;

-- 3. Add public SELECT policy for product-images
CREATE POLICY IF NOT EXISTS "Public Access for product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 4. Add public SELECT policy for offer-images
CREATE POLICY IF NOT EXISTS "Public Access for offer-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'offer-images');

-- 5. Verify buckets are public
SELECT id, name, public FROM storage.buckets 
WHERE id IN ('product-images', 'offer-images');

-- Expected output: Both buckets should show public = true
