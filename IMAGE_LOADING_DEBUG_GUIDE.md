# Image Loading Debug Guide

## Issue
Product and offer images are not displaying on customer mobile devices - showing placeholder icons instead.

## Debugging Steps

### Step 1: Check Browser Console on Mobile
1. Open the customer website on mobile
2. Open browser developer tools (Chrome: Menu > More Tools > Remote Devices)
3. Look for these console logs:
   - `=== RAW API RESPONSE ===`
   - `=== PRODUCTS LOADED ===`
   - `=== OFFERS LOADED ===`
4. Check if image URLs are present or if they're showing `/placeholder.svg`

### Step 2: Check Backend Logs (Vercel)
1. Go to Vercel dashboard: https://vercel.com
2. Select the `am2` project (backend)
3. Go to "Logs" tab
4. Look for:
   - `=== PRODUCTS API RESPONSE ===`
   - `=== OFFERS API RESPONSE ===`
5. Check if image URLs are being returned from database

### Step 3: Check Database Directly
Run these SQL queries in your database:

```sql
-- Check if products have images
SELECT 
  p.product_id,
  p.product_name,
  COUNT(pi.image_id) as image_count
FROM products p
LEFT JOIN product_images pi ON p.product_id = pi.product_id
WHERE p.is_active = true
GROUP BY p.product_id, p.product_name;

-- Check actual image URLs
SELECT 
  p.product_name,
  pi.image_url,
  pi.is_primary
FROM products p
INNER JOIN product_images pi ON p.product_id = pi.product_id
WHERE p.is_active = true
ORDER BY p.product_name, pi.display_order;

-- Check if offers have images
SELECT 
  o.offer_id,
  o.offer_name,
  COUNT(oi.image_id) as image_count
FROM offers o
LEFT JOIN offer_images oi ON o.offer_id = oi.offer_id
WHERE o.is_active = true
GROUP BY o.offer_id, o.offer_name;

-- Check actual offer image URLs
SELECT 
  o.offer_name,
  oi.image_url,
  oi.is_primary
FROM offers o
INNER JOIN offer_images oi ON o.offer_id = oi.offer_id
WHERE o.is_active = true
ORDER BY o.offer_name, oi.display_order;
```

### Step 4: Test Image URLs Directly
1. Copy an image URL from the database
2. Paste it directly in mobile browser
3. Check if it loads or gives an error

## Common Issues & Solutions

### Issue 1: No Images in Database
**Symptom**: Database queries return 0 images
**Solution**: Images need to be uploaded through admin dashboard
1. Go to Admin Dashboard > Products/Offers
2. Edit each product/offer
3. Upload images using the image upload feature

### Issue 2: Supabase Storage Not Configured
**Symptom**: Image URLs are NULL or empty
**Solution**: Configure Supabase Storage
1. Go to Supabase Dashboard
2. Create buckets: `product-images` and `offer-images`
3. Make buckets public
4. Add CORS policy

### Issue 3: Supabase Bucket Not Public
**Symptom**: Image URLs exist but return 403 Forbidden
**Solution**: Make Supabase buckets public
1. Go to Supabase Dashboard > Storage
2. Select bucket (`product-images` or `offer-images`)
3. Go to "Policies" tab
4. Add policy: "Public Access" for SELECT operations

### Issue 4: CORS Issues
**Symptom**: Images load on desktop but not mobile
**Solution**: Add CORS policy to Supabase Storage
1. Go to Supabase Dashboard > Storage > Configuration
2. Add CORS policy:
```json
[
  {
    "allowedOrigins": ["*"],
    "allowedMethods": ["GET"],
    "allowedHeaders": ["*"],
    "maxAgeSeconds": 3600
  }
]
```

### Issue 5: Invalid Image URLs
**Symptom**: Image URLs don't start with `https://`
**Solution**: Re-upload images through admin dashboard

## Quick Fix: Upload Images
If products/offers don't have images:

1. Go to Admin Dashboard: https://am-admin.vercel.app
2. Login with admin credentials
3. Go to Products or Offers page
4. For each product/offer:
   - Click "Edit"
   - Click "Upload Image"
   - Select image file
   - Click "Save"
5. Refresh customer website to see images

## Verification
After fixing:
1. Clear browser cache on mobile
2. Reload customer website
3. Images should now display
4. Check console logs to confirm image URLs are present

## Still Not Working?
If images still don't load after all steps:
1. Check Vercel environment variables have Supabase credentials
2. Verify Supabase project is active and not paused
3. Test API endpoint directly: `https://am2.vercel.app/api/products?is_active=true`
4. Check if response includes `images` array with valid URLs
