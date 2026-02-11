# ⚡ Quick Deploy Guide - 15 Minutes

Deploy your entire AM Fashions platform in 15 minutes!

---

## 🎯 What You Need

1. ✅ Vercel account (create at https://vercel.com/signup)
2. ✅ Your Supabase credentials (you have these)
3. ✅ 15 minutes of time

---

## 🚀 3 Simple Steps

### STEP 1: Deploy Backend (5 minutes)

1. Go to: https://vercel.com/new
2. Import: `am-fashions/aaaaaa`
3. Root Directory: `admin-dashboard/server`
4. Add these environment variables:

```
SUPABASE_URL=https://ghekzhxusoijeolsjnlo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWt6aHh1c29pamVvbHNqbmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTQwNjYsImV4cCI6MjA4NjM5MDA2Nn0.n9pCHjGrCp1lM6hj9u8jg4SKE4a1n6VRNGhgAV1dyz4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWt6aHh1c29pamVvbHNqbmxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDgxNDA2NiwiZXhwIjoyMDg2MzkwMDY2fQ.O8uYMQ1QqsVsszF6U7Y5xcBS--fiRH1duf9gUfxHDgo
DATABASE_URL=postgresql://postgres:AM_fashions1102@db.ghekzhxusoijeolsjnlo.supabase.co:5432/postgres
PORT=5000
NODE_ENV=production
JWT_SECRET=am-fashions-super-secret-jwt-key-2026-production-v1
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASS=mnfc xdxe ojpi rtzf
EMAIL_FROM=AM Fashiona <madasumiteesh@gmail.com>
ADMIN_EMAIL=madasumiteesh@gmail.com
```

5. Click "Deploy"
6. **COPY YOUR BACKEND URL** (e.g., `https://xyz.vercel.app`)

---

### STEP 2: Deploy Admin Dashboard (5 minutes)

1. Go to: https://vercel.com/new
2. Import: `am-fashions/aaaaaa`
3. Root Directory: `admin-dashboard/client`
4. Framework: Vite
5. Add environment variable:

```
VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
```

**⚠️ Replace `YOUR-BACKEND-URL` with the URL from Step 1**

6. Click "Deploy"
7. **COPY YOUR ADMIN URL**

---

### STEP 3: Deploy Main Website (5 minutes)

1. Go to: https://vercel.com/new
2. Import: `am-fashions/aaaaaa`
3. Root Directory: `.` (leave empty)
4. Framework: Create React App
5. Add environment variable:

```
REACT_APP_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
```

**⚠️ Replace `YOUR-BACKEND-URL` with the URL from Step 1**

6. Click "Deploy"
7. **COPY YOUR WEBSITE URL**

---

## 🔄 FINAL STEP: Update CORS (2 minutes)

1. Go to your backend project in Vercel
2. Settings → Environment Variables
3. Add these two:

```
FRONTEND_URL=https://YOUR-WEBSITE-URL.vercel.app
ADMIN_URL=https://YOUR-ADMIN-URL.vercel.app
```

4. Go to Deployments → Click "Redeploy"

---

## ✅ Test Your Deployment

### Test Backend
Visit: `https://your-backend.vercel.app/api/health`

Should see:
```json
{"status":"ok","database":"connected"}
```

### Test Admin
Visit: `https://your-admin.vercel.app`
Login: `admin@amfashions.com` / `admin123`

### Test Website
Visit: `https://your-website.vercel.app`
Browse products and add to cart

---

## 🎉 Done!

Your platform is now LIVE and accessible worldwide!

**Your URLs:**
- Website: `https://_________________.vercel.app`
- Admin: `https://_________________.vercel.app`
- API: `https://_________________.vercel.app`

---

## 📱 Share Your Website

Send your website URL to customers and start selling!

---

## 🆘 Issues?

Check the detailed guide: `COMPLETE_HOSTING_GUIDE.md`

Or contact: madasumiteesh@gmail.com
