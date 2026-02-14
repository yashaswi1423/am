# 🔧 Fix Local Database - Use Live Supabase Database

## 🎯 Problem
Your local development is using MySQL (localhost), but production uses Supabase PostgreSQL. This causes:
- ❌ Different data locally vs production
- ❌ Orders not showing properly
- ❌ Need to sync databases manually

## ✅ Solution
Configure local development to use the LIVE Supabase PostgreSQL database.

---

## 📋 Step-by-Step Fix (5 minutes)

### Step 1: Get Supabase Database Credentials

1. **Go to Supabase Dashboard:**
   - Visit: https://app.supabase.com
   - Select your project

2. **Get Database Connection String:**
   - Click **Settings** (gear icon) → **Database**
   - Scroll to **Connection string** section
   - Select **Connection pooling** tab
   - Copy the **Connection string** (starts with `postgresql://`)
   - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres`

3. **Get Supabase API Credentials:**
   - Click **Settings** → **API**
   - Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - Copy **anon public** key (long string starting with `eyJ...`)

### Step 2: Update Local Environment File

Edit `am/admin-dashboard/server/.env`:

```env
# Server Environment Variables

# ⚠️ LIVE Supabase PostgreSQL Database
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres

# Supabase Configuration (for file storage)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration (Gmail)
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com

# API Configuration
API_BASE_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Important:** Replace:
- `[YOUR-PASSWORD]` with your actual database password
- `xxxxx` with your actual project reference
- Keep the email credentials as they are

### Step 3: Restart Backend Server

```bash
cd am/admin-dashboard/server
npm start
```

You should see:
```
🗄️  Using PostgreSQL database
✅ Database connected successfully
✅ Supabase Storage initialized
🚀 Server running on port 5000
```

### Step 4: Verify It Works

1. **Open Admin Dashboard:** http://localhost:3000
2. **Login** with your admin credentials
3. **Check Orders page** - you should see all production orders
4. **Click on an order** - order details should display properly with all items

---

## 🔍 Troubleshooting

### "Connection refused" or "Database connection failed"

**Check:**
1. DATABASE_URL is correct (no spaces, correct password)
2. Your internet connection is working
3. Supabase project is active

**Fix:**
- Go to Supabase Dashboard → Settings → Database
- Copy the connection string again
- Make sure you're using **Connection pooling** (port 6543), not direct connection

### "No orders showing"

**Check:**
1. You're connected to the right database
2. Orders exist in production

**Verify:**
- Go to Supabase Dashboard → Table Editor
- Check `orders` table has data
- Check `order_items` table has data

### "Order items not showing in details"

**This is the main issue we're fixing!**

**Check:**
1. Database connection is using PostgreSQL (not MySQL)
2. Server logs show "Using PostgreSQL database"
3. `order_items` table exists and has data

**Fix:**
- Make sure DATABASE_URL is set in `.env`
- Restart the server
- Check server logs for errors

### "Supabase credentials not configured"

**Fix:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 What This Changes

### Before (MySQL Local):
```
Local Dev → MySQL (localhost) → Different data
Production → PostgreSQL (Supabase) → Live data
```
❌ Two separate databases to maintain

### After (PostgreSQL Live):
```
Local Dev → PostgreSQL (Supabase) → Live data
Production → PostgreSQL (Supabase) → Live data
```
✅ One database, always in sync

---

## ⚠️ Important Notes

1. **You're now working with LIVE data**
   - Be careful when testing
   - Don't delete real orders
   - Test orders will appear in production

2. **Database Changes Apply Immediately**
   - Any changes you make locally affect production
   - This is good for development but be cautious

3. **No More MySQL Needed**
   - You can stop XAMPP
   - No need to run local MySQL server
   - Everything uses Supabase now

---

## 🎯 Expected Results

After this fix:

✅ **Orders Page:**
- Shows all production orders
- Displays customer information
- Shows correct item counts
- Payment status visible

✅ **Order Details Modal:**
- Opens when clicking "View" button
- Shows all order items with:
  - Product names
  - Variant details (size, color)
  - Quantities
  - Prices
  - Subtotals
- Displays customer information
- Shows shipping address
- Shows order totals

✅ **Real-time Sync:**
- New orders from website appear immediately
- Status updates reflect instantly
- Payment verifications work correctly

---

## 🚀 Next Steps

Once this is working:

1. **Test Order Flow:**
   - Place a test order on website
   - Check it appears in admin dashboard
   - Verify all details are correct

2. **Test Payment Verification:**
   - Upload payment screenshot
   - Verify it appears in admin
   - Check screenshot displays correctly

3. **Deploy to Production:**
   - Your local setup now matches production
   - No surprises when deploying
   - Everything should work the same

---

## 📝 Quick Reference

**Supabase Dashboard:**
- URL: https://app.supabase.com
- Database Settings: Settings → Database
- API Settings: Settings → API
- Table Editor: View/edit data directly

**Local Admin Dashboard:**
- URL: http://localhost:3000
- Backend API: http://localhost:5000

**Environment File:**
- Location: `am/admin-dashboard/server/.env`
- Must have: DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY

---

## ✅ Verification Checklist

- [ ] DATABASE_URL is set in `.env`
- [ ] SUPABASE_URL is set in `.env`
- [ ] SUPABASE_ANON_KEY is set in `.env`
- [ ] Server starts without errors
- [ ] Server logs show "Using PostgreSQL database"
- [ ] Admin dashboard loads
- [ ] Orders page shows orders
- [ ] Order details modal opens
- [ ] Order items display correctly
- [ ] Payment screenshots display

---

**Need Help?** Check the server logs for specific error messages!
