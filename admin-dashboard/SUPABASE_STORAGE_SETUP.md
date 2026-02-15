# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for payment screenshot uploads.

## Why Supabase Storage?

- ✅ Works perfectly with Vercel (serverless-friendly)
- ✅ Free tier: 1GB storage
- ✅ Public URLs for easy access
- ✅ Secure and reliable
- ✅ No local filesystem needed

## Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Bucket name: `payment-screenshots`
4. Make it **Public** (so screenshots can be viewed)
5. Click **Create bucket**

## Step 3: Set Bucket Policies

1. Click on the `payment-screenshots` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Add these policies:

### Policy 1: Allow Public Read
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'payment-screenshots' );
```

### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'payment-screenshots' );
```

### Policy 3: Allow Authenticated Delete
```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'payment-screenshots' );
```

## Step 4: Update Environment Variables

### For Local Development
Edit `am/admin-dashboard/server/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### For Vercel Deployment
Add these environment variables in Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   - `SUPABASE_URL` = `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY` = `your_anon_key_here`

## Step 5: Update Database Schema

Run this SQL in your database:

```sql
ALTER TABLE payment_verifications 
ADD COLUMN screenshot_url VARCHAR(500) AFTER screenshot_filename;
```

Or run the migration file:
```bash
mysql -u root -p ecommerce_admin < database/add_screenshot_url_column.sql
```

## Step 6: Test the Setup

1. Restart your backend server:
   ```bash
   cd am/admin-dashboard/server
   npm start
   ```

2. Place a test order with payment screenshot
3. Check the admin dashboard → Payment Verifications
4. Screenshot should load from Supabase

## Verification Checklist

- [ ] Supabase project created
- [ ] Storage bucket `payment-screenshots` created
- [ ] Bucket is set to **Public**
- [ ] Storage policies added
- [ ] Environment variables added to `.env`
- [ ] Database column `screenshot_url` added
- [ ] Backend server restarted
- [ ] Test upload successful
- [ ] Screenshot visible in admin dashboard

## Troubleshooting

### Screenshots not uploading
- Check Supabase credentials in `.env`
- Verify bucket name is exactly `payment-screenshots`
- Check bucket is set to Public

### Screenshots not displaying
- Check if `screenshot_url` column exists in database
- Verify storage policies are active
- Check browser console for errors

### Vercel deployment issues
- Ensure environment variables are set in Vercel
- Check Vercel logs for errors
- Verify Supabase URL is accessible

## Cost Estimate

**Supabase Free Tier:**
- 1GB storage
- 2GB bandwidth/month
- Unlimited API requests

**Estimated usage:**
- Average screenshot: 200KB
- 1GB = ~5,000 screenshots
- More than enough for most businesses!

## Migration from Local Storage

If you have existing screenshots in `uploads/` folder:

1. They will continue to work via the fallback route
2. New uploads will go to Supabase
3. Old screenshots can be manually migrated if needed

## Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Check backend server logs
3. Verify all environment variables are set
4. Ensure database schema is updated

---

**Ready to deploy!** Once setup is complete, your payment verification system will work perfectly on Vercel! 🚀
