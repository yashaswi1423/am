# Fix Supabase Upload Error - RLS Policy Issue

## The Problem
Error: "StorageApiError: new row violates row-level security policy"

This happens because Supabase Storage has Row Level Security (RLS) enabled, but the backend is using the anonymous key which doesn't have permission to upload files.

## Solution: Use Service Role Key

### Step 1: Get Service Role Key from Supabase
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Scroll down to **Project API keys**
5. Copy the **service_role** key (NOT the anon/public key)
   - It starts with `eyJ...` and is very long
   - ⚠️ Keep this secret! It bypasses all RLS policies

### Step 2: Add to Vercel Backend
1. Go to https://vercel.com/dashboard
2. Find your **backend project** (am-git-main-yashaswis-projects-bedecf50)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: [paste the service_role key from Step 1]
   - **Environments**: Select all (Production, Preview, Development)
6. Click **Save**

### Step 3: Redeploy Backend
1. Go to **Deployments** tab
2. Click latest deployment → Three dots (•••) → **Redeploy**
3. Uncheck "Use existing Build Cache"
4. Click **Redeploy**

### Step 4: Test
After deployment completes (1-2 minutes):
1. Go to www.am-fashions.in
2. Try submitting a payment with screenshot
3. Should work now! ✅

## Alternative: Configure RLS Policies (More Secure)

If you prefer to keep using the anon key and configure proper policies:

1. Go to Supabase Dashboard → **Storage** → **Policies**
2. Select `payment-screenshots` bucket
3. Click **New Policy**
4. Add these policies:

**Allow Uploads:**
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-screenshots');
```

**Allow Public Access:**
```sql
CREATE POLICY "Allow public access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-screenshots');
```

## Verify It's Working

Check the Vercel logs after redeployment. You should see:
- ✅ "File uploaded successfully"
- ✅ "Verification record inserted"

Instead of:
- ❌ "File upload error: StorageApiError"

## Troubleshooting

If still not working:
1. Check Vercel environment variables are saved
2. Make sure you redeployed AFTER adding the variable
3. Check Supabase bucket exists and is named `payment-screenshots`
4. Verify the service role key is correct (copy-paste carefully)
