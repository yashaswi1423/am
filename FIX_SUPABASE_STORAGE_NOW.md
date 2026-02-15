# 🔧 Fix Supabase Storage - Row Level Security Issue

## Problem
Images are failing to upload with error: "new row violates row-level security policy"

This means the `product-images` bucket has RLS (Row Level Security) enabled but no policies allow uploads.

## Solution: Disable RLS or Add Policies

### Option 1: Disable RLS (Quickest - Recommended for Testing)

1. Go to https://app.supabase.com/project/ghekzhxusoijeolsjnlo/storage/buckets
2. Find the `product-images` bucket
3. Click on the bucket name
4. Click "Policies" tab
5. Click "Disable RLS" button
6. Confirm

### Option 2: Add Policies (Better for Production)

If you want to keep RLS enabled, add these policies:

1. Go to https://app.supabase.com/project/ghekzhxusoijeolsjnlo/storage/policies
2. Click "New Policy"
3. Select `product-images` bucket

**Policy 1: Allow Public Uploads**
- Name: `Allow public uploads`
- Allowed operation: `INSERT`
- Policy definition: `true`
- Click "Save"

**Policy 2: Allow Public Reads**
- Name: `Allow public reads`
- Allowed operation: `SELECT`
- Policy definition: `true`
- Click "Save"

**Policy 3: Allow Public Updates**
- Name: `Allow public updates`
- Allowed operation: `UPDATE`
- Policy definition: `true`
- Click "Save"

**Policy 4: Allow Public Deletes**
- Name: `Allow public deletes`
- Allowed operation: `DELETE`
- Policy definition: `true`
- Click "Save"

## Quick Fix (SQL)

Or run this SQL in Supabase SQL Editor:

```sql
-- Disable RLS on product-images bucket
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Or add policies
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow public updates" ON storage.objects
  FOR UPDATE TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow public deletes" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id = 'product-images');
```

## After Fixing

1. Go back to admin dashboard
2. Try uploading an image again
3. It should work now!

## Verify Bucket Settings

Make sure your `product-images` bucket has:
- ✅ Public bucket: ON
- ✅ File size limit: 5MB or more
- ✅ Allowed MIME types: image/* (or leave empty for all)

## Test

After fixing, try:
1. Go to http://localhost:3002/inventory
2. Edit a product
3. Click "Upload Image File"
4. Select an image
5. Should upload successfully!
