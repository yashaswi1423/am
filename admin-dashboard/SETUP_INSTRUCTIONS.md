# 🚀 Complete Setup Instructions

## What Changed?

The payment screenshot system now uses **Supabase Storage** instead of local filesystem. This makes it compatible with Vercel and other serverless platforms!

## 📋 Setup Steps

### 1. Update Database Schema

Open phpMyAdmin or your MySQL client and run:

```sql
ALTER TABLE payment_verifications 
ADD COLUMN screenshot_url VARCHAR(500) AFTER screenshot_filename;
```

### 2. Get Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL**
   - **anon public key**

### 3. Create Storage Bucket

1. In Supabase, go to **Storage**
2. Click **New bucket**
3. Name: `payment-screenshots`
4. Make it **Public** ✅
5. Click **Create**

### 4. Set Storage Policies

Click on your bucket → **Policies** → **New Policy** → Add these:

**Allow Public Read:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'payment-screenshots' );
```

**Allow Upload:**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'payment-screenshots' );
```

### 5. Update .env File

Edit `am/admin-dashboard/server/.env` and add:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual values from Step 2!

### 6. Restart Backend Server

Stop the current server (Ctrl+C) and restart:

```bash
cd am/admin-dashboard/server
npm start
```

### 7. Test It!

1. Go to main website
2. Add item to cart
3. Place order with payment screenshot
4. Check admin dashboard → Payment Verifications
5. Screenshot should load! ✅

## ✅ Verification

You'll know it's working when:
- Backend logs show: `✅ Supabase Storage initialized`
- Screenshots upload successfully
- Images display in admin dashboard
- No errors in console

## 🚀 For Vercel Deployment

When deploying to Vercel, add these environment variables:

1. Go to Vercel project → Settings → Environment Variables
2. Add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - All other existing variables

## 📝 Important Notes

- Old screenshots in `uploads/` folder will still work (fallback)
- New uploads go to Supabase automatically
- Free tier: 1GB storage (enough for ~5,000 screenshots!)
- Works perfectly with Vercel serverless functions

## 🆘 Troubleshooting

**"Supabase credentials not found"**
- Check `.env` file has correct values
- Restart backend server

**Screenshots not uploading**
- Verify bucket name is exactly `payment-screenshots`
- Check bucket is set to Public
- Verify storage policies are active

**Screenshots not displaying**
- Check database has `screenshot_url` column
- Verify Supabase URL is accessible
- Check browser console for errors

---

Need help? Check `SUPABASE_STORAGE_SETUP.md` for detailed guide!
