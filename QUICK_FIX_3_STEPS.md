# 🚀 QUICK FIX - 3 STEPS ONLY

## The Problem
Orders show up but items are empty → "No items found for this order"

## The Solution (10 minutes)

### 1️⃣ RUN SQL IN SUPABASE (5 min)

```
1. Go to: https://app.supabase.com
2. Open project: ghekzhxusoijeolsjnlo
3. Click: SQL Editor → New Query
4. Copy ALL from: am-main/COMPLETE_SUPABASE_SETUP.sql
5. Paste and click RUN
6. See: "Database setup complete!" ✅
```

### 2️⃣ UPDATE VERCEL (3 min)

```
1. Go to: https://vercel.com
2. Open: am-seven-coral project
3. Settings → Environment Variables
4. Edit DATABASE_URL to:
   postgresql://postgres.ghekzhxusoijeolsjnlo:AM_fashions1102@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
5. Save ✅
```

### 3️⃣ REDEPLOY (2 min)

```
1. Still in Vercel
2. Deployments tab
3. Click ⋯ on latest deployment
4. Click Redeploy
5. Wait for green checkmark ✅
```

## ✅ TEST IT

1. Place order on website
2. Check admin dashboard
3. Click on order
4. See items! 🎉

---

**That's it!** No code changes needed. Just configuration.

**Files to use:**
- `am-main/COMPLETE_SUPABASE_SETUP.sql` ← Copy this to Supabase
- `am-main/FINAL_FIX_CHECKLIST.md` ← Detailed guide if needed
- `am-main/SUPABASE_FIX_NOW.md` ← Alternative guide

**Connection String** (copy exactly):
```
postgresql://postgres.ghekzhxusoijeolsjnlo:AM_fashions1102@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
```

**Important**: Use port `6543` (pooled) NOT `5432` (direct)
