# 📁 Folder Structure & Deployment Guide

## Current Project Structure

```
am-with-emailjs/                          ← ROOT FOLDER
│
├── 🛍️ MAIN WEBSITE (Customer Site)
│   ├── src/                              ← React source code
│   ├── public/                           ← Public assets
│   ├── package.json                      ← Dependencies
│   ├── .env.production                   ← Production config
│   └── vercel.json                       ← Vercel config
│
├── admin-dashboard/                      ← ADMIN FOLDER
│   │
│   ├── 👨‍💼 ADMIN DASHBOARD
│   │   └── client/                       ← Admin React app
│   │       ├── src/                      ← Admin source code
│   │       ├── package.json              ← Admin dependencies
│   │       ├── .env.production           ← Admin production config
│   │       └── vercel.json               ← Admin Vercel config
│   │
│   ├── 🔧 BACKEND API
│   │   └── server/                       ← Backend Node.js app
│   │       ├── config/                   ← Database configs
│   │       ├── controllers/              ← API logic
│   │       ├── routes/                   ← API routes
│   │       ├── services/                 ← Email service
│   │       ├── middleware/               ← Auth middleware
│   │       ├── package.json              ← Backend dependencies
│   │       ├── server.js                 ← Main server file
│   │       └── .env                      ← Local config (not deployed)
│   │
│   └── 🗄️ DATABASE
│       └── database/                     ← SQL files
│           ├── postgresql_setup.sql      ← PostgreSQL schema
│           └── complete_setup.sql        ← MySQL schema
│
└── 📚 DOCUMENTATION
    ├── DEPLOY_EVERYTHING.md              ← Main deployment guide
    ├── VERCEL_SUPABASE_DEPLOYMENT.md    ← Vercel + Supabase guide
    └── COMPLETE_DEPLOYMENT_GUIDE.md     ← Detailed guide
```

---

## 🎯 What to Deploy Where

### 1️⃣ BACKEND API → Vercel

**Folder to deploy:**
```
admin-dashboard/server/
```

**What's inside:**
- ✅ server.js (main file)
- ✅ config/ (database connection)
- ✅ controllers/ (business logic)
- ✅ routes/ (API endpoints)
- ✅ services/ (email service)
- ✅ middleware/ (authentication)
- ✅ package.json (dependencies)

**Vercel Configuration:**
- Root Directory: `admin-dashboard/server`
- Build Command: `npm install`
- Framework: Other

---

### 2️⃣ ADMIN DASHBOARD → Vercel

**Folder to deploy:**
```
admin-dashboard/client/
```

**What's inside:**
- ✅ src/ (React components)
- ✅ public/ (assets)
- ✅ package.json (dependencies)
- ✅ .env.production (API URL)
- ✅ vercel.json (Vercel config)

**Vercel Configuration:**
- Root Directory: `admin-dashboard/client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

---

### 3️⃣ MAIN WEBSITE → Vercel

**Folder to deploy:**
```
./ (root folder)
```

**What's inside:**
- ✅ src/ (React components)
- ✅ public/ (product images)
- ✅ package.json (dependencies)
- ✅ .env.production (API URL)
- ✅ vercel.json (Vercel config)

**Vercel Configuration:**
- Root Directory: `./` (leave blank)
- Build Command: `npm run build`
- Output Directory: `build`
- Framework: Create React App

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend

1. Go to Vercel Dashboard
2. Click "Add New..." → "Project"
3. Import your repository
4. Configure:
   - **Project Name:** `am-fashions-backend`
   - **Root Directory:** `admin-dashboard/server`
   - **Framework:** Other
   - **Build Command:** `npm install`

5. Add environment variables (see DEPLOY_EVERYTHING.md)
6. Click "Deploy"
7. Copy backend URL: `https://am-fashions-backend.vercel.app`

---

### Step 2: Deploy Admin Dashboard

1. Vercel Dashboard → "Add New..." → "Project"
2. Import SAME repository
3. Configure:
   - **Project Name:** `am-fashions-admin`
   - **Root Directory:** `admin-dashboard/client`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Add environment variable:
   - `VITE_API_URL` = `https://am-fashions-backend.vercel.app/api`

5. Click "Deploy"
6. Copy admin URL: `https://am-fashions-admin.vercel.app`

---

### Step 3: Deploy Main Website

1. Vercel Dashboard → "Add New..." → "Project"
2. Import SAME repository
3. Configure:
   - **Project Name:** `am-fashions`
   - **Root Directory:** `./` (leave blank or root)
   - **Framework:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. Add environment variable:
   - `REACT_APP_API_URL` = `https://am-fashions-backend.vercel.app/api`

5. Click "Deploy"
6. Copy website URL: `https://am-fashions.vercel.app`

---

## 📝 Important Files

### Backend (.env in Vercel)
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
PORT=5000
NODE_ENV=production
JWT_SECRET=random-string
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com
FRONTEND_URL=https://am-fashions.vercel.app
ADMIN_URL=https://am-fashions-admin.vercel.app
```

### Admin Dashboard (.env.production)
```
VITE_API_URL=https://am-fashions-backend.vercel.app/api
```

### Main Website (.env.production)
```
REACT_APP_API_URL=https://am-fashions-backend.vercel.app/api
```

---

## ✅ Verification Checklist

After deployment, verify:

### Backend:
- [ ] Visit: `https://your-backend.vercel.app/api/health`
- [ ] Should see: `{"status":"OK","database":"Connected"}`

### Admin Dashboard:
- [ ] Visit: `https://your-admin.vercel.app`
- [ ] Should see login page
- [ ] Can request login
- [ ] Receive approval email

### Main Website:
- [ ] Visit: `https://your-website.vercel.app`
- [ ] Can see products
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can upload payment screenshot

---

## 🔄 How It All Connects

```
┌─────────────────────────────────────────────┐
│  CUSTOMER                                   │
│  Opens: https://am-fashions.vercel.app      │
└──────────────┬──────────────────────────────┘
               │
               ↓ API Calls
┌─────────────────────────────────────────────┐
│  BACKEND API                                │
│  https://am-fashions-backend.vercel.app     │
│  - Processes orders                         │
│  - Sends emails                             │
│  - Handles payments                         │
└──────────────┬──────────────────────────────┘
               │
               ↓ Database Queries
┌─────────────────────────────────────────────┐
│  SUPABASE DATABASE                          │
│  PostgreSQL (500MB)                         │
│  - Stores products                          │
│  - Stores orders                            │
│  - Stores customers                         │
└─────────────────────────────────────────────┘
               ↑
               │ Database Queries
┌──────────────┴──────────────────────────────┐
│  ADMIN DASHBOARD                            │
│  https://am-fashions-admin.vercel.app       │
│  - Manages orders                           │
│  - Verifies payments                        │
│  - Views customers                          │
└─────────────────────────────────────────────┘
```

---

## 🎯 Quick Reference

### Deploy Commands (if needed):
```bash
# Update code
git add .
git commit -m "Update"
git push origin main

# All three services auto-deploy!
```

### Folder Paths for Vercel:

| Component | Root Directory |
|-----------|----------------|
| Backend | `admin-dashboard/server` |
| Admin | `admin-dashboard/client` |
| Website | `./` (blank) |

### URLs After Deployment:

| Component | URL |
|-----------|-----|
| Backend | `https://am-fashions-backend.vercel.app` |
| Admin | `https://am-fashions-admin.vercel.app` |
| Website | `https://am-fashions.vercel.app` |

---

## 💡 Pro Tips

1. **Same Repository, Three Projects**
   - You deploy the SAME GitHub repository THREE times
   - Each time, you specify a different Root Directory
   - Vercel knows which folder to build

2. **Environment Variables**
   - Backend: 12 variables (database, email, etc.)
   - Admin: 1 variable (API URL)
   - Website: 1 variable (API URL)

3. **Auto-Deploy**
   - Push to GitHub = All three redeploy automatically
   - No need to manually redeploy

4. **Testing**
   - Always test backend first (`/api/health`)
   - Then test website
   - Finally test admin dashboard

---

## 🆘 Common Issues

### "Root Directory not found"
→ Make sure you typed the path exactly:
- Backend: `admin-dashboard/server`
- Admin: `admin-dashboard/client`
- Website: leave blank or `./`

### "Build failed"
→ Check the build logs in Vercel
→ Verify package.json exists in the Root Directory

### "Cannot connect to API"
→ Check environment variables
→ Make sure API URLs are correct
→ Verify backend is deployed and running

---

## 📚 Full Guides

For complete step-by-step instructions, see:
- **DEPLOY_EVERYTHING.md** - Complete guide with all steps
- **VERCEL_SUPABASE_DEPLOYMENT.md** - Vercel + Supabase specific
- **COMPLETE_DEPLOYMENT_GUIDE.md** - Detailed with screenshots

---

**You're ready to deploy!** 🚀

Follow DEPLOY_EVERYTHING.md for the complete process.
