# 🚀 Deploy Complete Inventory System to Production

## ✅ What's Ready to Deploy

Your complete inventory management system is now ready:
- ✅ Admin dashboard with product management
- ✅ Image upload to Supabase Storage
- ✅ Main website fetches products from database
- ✅ Order system with product details
- ✅ Authentication system
- ✅ Variant management (colors, sizes, stock)

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Complete inventory system with image upload"
git push origin main
```

## Step 2: Deploy Backend (Admin Dashboard Server)

### A. Vercel Deployment
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Root Directory**: `am/admin-dashboard/server`
5. Click "Deploy"

### B. Add Environment Variables in Vercel
After deployment, go to Project Settings → Environment Variables and add:

```env
# Database
DATABASE_URL=postgresql://postgres.ghekzhxusoijeolsjnlo:AM_fashions1102@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres

# Supabase Storage
SUPABASE_URL=https://ghekzhxusoijeolsjnlo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWt6aHh1c29pamVvbHNqbmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTQwNjYsImV4cCI6MjA4NjM5MDA2Nn0.n9pCHjGrCp1lM6hj9u8jg4SKE4a1n6VRNGhgAV1dyz4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWt6aHh1c29pamVvbHNqbmxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDgxNDA2NiwiZXhwIjoyMDg2MzkwMDY2fQ.O8uYMQ1QqsVsszF6U7Y5xcBS--fiRH1duf9gUfxHDgo

# Email
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com

# Server Config
PORT=5000
NODE_ENV=production
```

### C. Get Backend URL
After deployment, copy the Vercel URL (e.g., `https://your-backend.vercel.app`)

## Step 3: Deploy Admin Dashboard (Client)

### A. Update API URL
1. Open `am/admin-dashboard/client/.env.production`
2. Update with your backend URL:
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

### B. Deploy to Vercel
1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Root Directory**: `am/admin-dashboard/client`
5. **Framework Preset**: Vite
6. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.vercel.app/api`
7. Click "Deploy"

### C. Get Admin Dashboard URL
Copy the URL (e.g., `https://your-admin.vercel.app`)

## Step 4: Deploy Main Website

### A. Update API URL
1. Create `am/.env.production` if it doesn't exist:
```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

### B. Deploy to Vercel
1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Root Directory**: `am`
5. **Framework Preset**: Create React App
6. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend.vercel.app/api`
7. Click "Deploy"

## Step 5: Update Backend CORS

After all deployments, update backend to allow your frontend URLs:

1. Go to backend Vercel project
2. Add environment variables:
```env
FRONTEND_URL=https://your-main-website.vercel.app
ADMIN_DASHBOARD_URL=https://your-admin.vercel.app
```

3. Redeploy backend

## Step 6: Test Everything

### Test Admin Dashboard
1. Go to `https://your-admin.vercel.app`
2. Login with `admin` / `admin123`
3. Go to Inventory
4. Add a product with image
5. Should upload successfully

### Test Main Website
1. Go to `https://your-main-website.vercel.app`
2. Should see products from database
3. Click on a product
4. Should show correct colors/sizes
5. Add to cart and place order

### Test Orders
1. Place an order on main website
2. Check admin dashboard Orders page
3. Should see order with product details

## Important Notes

### ✅ What Will Work
- Product management in admin dashboard
- Image uploads to Supabase Storage
- Products display on main website
- Orders with product details
- Stock management
- Variant management (colors, sizes)

### ⚠️ Environment Variables Required

**Backend (Admin Dashboard Server):**
- DATABASE_URL
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (IMPORTANT!)
- EMAIL_USER
- EMAIL_PASSWORD
- ADMIN_EMAIL

**Admin Dashboard Client:**
- VITE_API_URL

**Main Website:**
- REACT_APP_API_URL

### 🔒 Security Notes

1. **Never commit .env files to GitHub** - They're already in .gitignore
2. **Service Role Key** - Keep this secret! Only use in backend
3. **Anon Key** - Safe to use in frontend
4. **Database Password** - Keep secret

## Troubleshooting

### Images not uploading in production?
- Check SUPABASE_SERVICE_ROLE_KEY is set in Vercel
- Check Supabase Storage bucket is public
- Check backend logs in Vercel

### Products not showing on main website?
- Check REACT_APP_API_URL is correct
- Check backend is deployed and running
- Check browser console for errors

### CORS errors?
- Add FRONTEND_URL and ADMIN_DASHBOARD_URL to backend env vars
- Redeploy backend

## Quick Deployment Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Complete inventory system"
git push origin main

# 2. Deploy all three projects in Vercel
# - Backend: am/admin-dashboard/server
# - Admin: am/admin-dashboard/client
# - Website: am

# 3. Add environment variables in each project

# 4. Test everything!
```

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables added
- [ ] Admin dashboard deployed to Vercel
- [ ] Admin dashboard environment variables added
- [ ] Main website deployed to Vercel
- [ ] Main website environment variables added
- [ ] Can login to admin dashboard
- [ ] Can upload images
- [ ] Can create products
- [ ] Products show on main website
- [ ] Can place orders
- [ ] Orders show in admin dashboard

Once all checked, you're live! 🎉
