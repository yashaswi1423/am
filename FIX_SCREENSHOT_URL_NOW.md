# 🚨 URGENT FIX - Add Missing Column

## The Error

```
Insert error: column "screenshot_url" of relation "payment_verifications" does not exist
```

## The Fix (2 minutes)

### Step 1: Add Missing Column in Supabase

1. Go to: https://app.supabase.com
2. Open project: `ghekzhxusoijeolsjnlo`
3. Click **SQL Editor** → **New Query**
4. Copy and paste this:

```sql
ALTER TABLE payment_verifications 
ADD COLUMN IF NOT EXISTS screenshot_url VARCHAR(500);
```

5. Click **Run** (or Ctrl+Enter)
6. You should see: "Success. No rows returned"

### Step 2: Test It

1. Go back to your website
2. Try placing an order again
3. Should work now! ✅

---

## What Happened?

The `COMPLETE_SUPABASE_SETUP.sql` file I created was missing the `screenshot_url` column in the `payment_verifications` table. This column is needed to store the Supabase Storage URL for payment screenshots.

## Alternative: Run Complete Setup Again

If you want to be 100% sure everything is correct, you can:

1. Drop the old table:
```sql
DROP TABLE IF EXISTS payment_verifications CASCADE;
```

2. Run the updated `COMPLETE_SUPABASE_SETUP.sql` file again (I've fixed it now)

But the quick fix above should work fine!

---

**Time to fix**: 2 minutes
**Then orders will work!** 🎉
