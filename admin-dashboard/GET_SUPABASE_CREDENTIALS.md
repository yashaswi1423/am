# 🔑 How to Get Supabase Credentials

## Quick Guide (2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: **https://app.supabase.com**
2. Sign in with your account
3. Select your project from the list

---

### Step 2: Get Database Connection String

1. Click **Settings** (⚙️ gear icon in sidebar)
2. Click **Database**
3. Scroll down to **Connection string** section
4. Click **Connection pooling** tab (important!)
5. Copy the connection string

**It looks like:**
```
postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password!

**Where to find your password:**
- If you saved it when creating the project, use that
- If you forgot it, click **Database** → **Database Password** → **Reset Database Password**

---

### Step 3: Get API Credentials

1. Click **Settings** (⚙️ gear icon)
2. Click **API**
3. You'll see two important values:

**Project URL:**
```
https://abcdefghijk.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1NjcwMDAsImV4cCI6MjAwNTE0MzAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Copy both of these!

---

### Step 4: Update Your .env File

Open `am/admin-dashboard/server/.env` and update:

```env
# Replace these with your actual values:
DATABASE_URL=postgresql://postgres.abcdefghijk:YOUR_ACTUAL_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1NjcwMDAsImV4cCI6MjAwNTE0MzAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Keep these as they are:
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com
API_BASE_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
PORT=5000
NODE_ENV=development
```

---

## 🎯 Complete .env File Template

Here's what your complete `.env` file should look like:

```env
# Server Environment Variables

# Supabase PostgreSQL Database (LIVE)
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres

# Supabase Configuration (for file storage)
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_ACTUAL_KEY

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

---

## ✅ Verify It's Working

After updating `.env`:

1. **Restart your backend server:**
   ```bash
   cd am/admin-dashboard/server
   npm start
   ```

2. **Check the logs - you should see:**
   ```
   🗄️  Using PostgreSQL database
   ✅ Database connected successfully
   ✅ Supabase Storage initialized
   🚀 Server running on port 5000
   ```

3. **If you see errors:**
   - Check DATABASE_URL has correct password
   - Check no extra spaces in .env file
   - Check SUPABASE_URL and SUPABASE_ANON_KEY are correct

---

## 🔍 Common Issues

### "Database connection failed"
- ✅ Check your database password is correct
- ✅ Make sure you're using **Connection pooling** (port 6543)
- ✅ Check your internet connection

### "Supabase credentials not configured"
- ✅ Check SUPABASE_URL is set
- ✅ Check SUPABASE_ANON_KEY is set
- ✅ Make sure there are no quotes around the values

### "Using MySQL database" (should be PostgreSQL)
- ✅ Make sure DATABASE_URL is set in .env
- ✅ Restart the server after updating .env
- ✅ Check for typos in DATABASE_URL

---

## 📸 Visual Guide

**Supabase Dashboard → Settings → Database:**
```
┌─────────────────────────────────────────┐
│ Connection string                        │
├─────────────────────────────────────────┤
│ [URI] [Connection pooling] [Session]    │ ← Click "Connection pooling"
├─────────────────────────────────────────┤
│ postgresql://postgres.abc:...           │ ← Copy this
└─────────────────────────────────────────┘
```

**Supabase Dashboard → Settings → API:**
```
┌─────────────────────────────────────────┐
│ Project URL                              │
│ https://abc.supabase.co                 │ ← Copy this
├─────────────────────────────────────────┤
│ API Keys                                 │
│ anon public                              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...        │ ← Copy this
└─────────────────────────────────────────┘
```

---

## 🚀 Next Steps

Once your .env is configured:

1. ✅ Restart backend server
2. ✅ Open admin dashboard: http://localhost:3000
3. ✅ Check Orders page - should show all orders
4. ✅ Click on an order - should show all items
5. ✅ Everything should work perfectly!

---

**Need more help?** Check `FIX_LOCAL_DATABASE.md` for detailed troubleshooting!
