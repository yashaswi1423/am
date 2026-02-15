# ⚡ Quick Fix Checklist

## 🎯 Goal
Fix local database to use live Supabase PostgreSQL and display order details properly.

---

## ✅ 5-Minute Checklist

### □ Step 1: Get Credentials (2 min)

Go to: https://app.supabase.com

**Get DATABASE_URL:**
- Settings → Database → Connection string → **Connection pooling** tab
- Copy: `postgresql://postgres.xxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres`

**Get SUPABASE_URL:**
- Settings → API → Project URL
- Copy: `https://xxx.supabase.co`

**Get SUPABASE_ANON_KEY:**
- Settings → API → anon public key
- Copy: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### □ Step 2: Update .env (1 min)

Edit: `am/admin-dashboard/server/.env`

```env
DATABASE_URL=postgresql://postgres.xxx:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com
API_BASE_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
PORT=5000
NODE_ENV=development
```

---

### □ Step 3: Restart Server (1 min)

```bash
cd am/admin-dashboard/server
npm start
```

**Must see:**
```
🗄️  Using PostgreSQL database  ← IMPORTANT!
✅ Database connected successfully
✅ Supabase Storage initialized
```

---

### □ Step 4: Test (1 min)

1. Open: http://localhost:3000
2. Login to admin dashboard
3. Go to Orders page
4. Click "View" on any order
5. **Order items should display!** ✅

---

## 🚨 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| "Using MySQL database" | Add DATABASE_URL to .env |
| "Connection failed" | Check password in DATABASE_URL |
| "Supabase not configured" | Add SUPABASE_URL and SUPABASE_ANON_KEY |
| "No items showing" | Restart server, check logs |

---

## 📚 Detailed Guides

- **START_HERE_DATABASE_FIX.md** - Complete overview
- **GET_SUPABASE_CREDENTIALS.md** - Credential guide
- **FIX_LOCAL_DATABASE.md** - Detailed setup
- **TEST_DATABASE_CONNECTION.md** - Testing guide

---

## ✅ Success = All Green

- ✅ Server logs: "Using PostgreSQL database"
- ✅ Orders page: Shows orders
- ✅ Order details: Shows items with names, variants, prices
- ✅ Customer info: Displays correctly
- ✅ Payment status: Shows correctly

---

**Time to complete:** 5 minutes
**Difficulty:** Easy
**Result:** Everything works! 🎉
