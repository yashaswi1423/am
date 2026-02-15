# 🚀 Complete Hosting Guide - AM Fashions

This guide will help you deploy all three components of your platform to Vercel (100% FREE).

## 📋 What We'll Deploy

1. **Backend API** → Vercel Serverless Functions
2. **Admin Dashboard** → Vercel Static Hosting
3. **Main Website** → Vercel Static Hosting

---

## 🎯 Prerequisites

- ✅ GitHub account (you already have the repo)
- ✅ Vercel account (free - we'll create this)
- ✅ Supabase database (already set up)
- ✅ Gmail for emails (already configured)

---

# STEP-BY-STEP DEPLOYMENT

## STEP 1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Complete the signup

---

## STEP 2: Deploy Backend API (Port 5000 → Vercel)

### 2.1 Prepare Backend for Vercel

The backend needs a special configuration file. Let me check if it exists...

### 2.2 Import Backend to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository: `am-fashions/aaaaaa`
4. **IMPORTANT**: Set Root Directory to `admin-dashboard/server`
5. Click "Continue"

### 2.3 Configure Backend Settings

**Framework Preset**: Other
**Build Command**: Leave empty
**Output Directory**: Leave empty
**Install Command**: `npm install`

### 2.4 Add Environment Variables

Click "Environment Variables" and add these ONE BY ONE:

```
SUPABASE_URL
https://ghekzhxusoijeolsjnlo.supabase.co

SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWt6aHh1c29pamVvbHNqbmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTQwNjYsImV4cCI6MjA4NjM5MDA2Nn0.n9pCHjGrCp1lM6hj9u8jg4SKE4a1n6VRNGhgAV1dyz4

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWt6aHh1c29pamVvbHNqbmxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDgxNDA2NiwiZXhwIjoyMDg2MzkwMDY2fQ.O8uYMQ1QqsVsszF6U7Y5xcBS--fiRH1duf9gUfxHDgo

DATABASE_URL
postgresql://postgres:AM_fashions1102@db.ghekzhxusoijeolsjnlo.supabase.co:5432/postgres

PORT
5000

NODE_ENV
production

JWT_SECRET
am-fashions-super-secret-jwt-key-2026-production-v1

EMAIL_HOST
smtp.gmail.com

EMAIL_PORT
587

EMAIL_USER
madasumiteesh@gmail.com

EMAIL_PASS
mnfc xdxe ojpi rtzf

EMAIL_FROM
AM Fashiona <madasumiteesh@gmail.com>

ADMIN_EMAIL
madasumiteesh@gmail.com
```

### 2.5 Deploy Backend

1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. Once done, you'll get a URL like: `https://your-backend.vercel.app`
4. **SAVE THIS URL** - you'll need it for the frontend apps

### 2.6 Test Backend

Visit: `https://your-backend.vercel.app/api/health`

You should see:
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## STEP 3: Deploy Admin Dashboard (Port 3001 → Vercel)

### 3.1 Import Admin Dashboard to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository: `am-fashions/aaaaaa`
4. **IMPORTANT**: Set Root Directory to `admin-dashboard/client`
5. Click "Continue"

### 3.2 Configure Admin Dashboard Settings

**Framework Preset**: Vite
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### 3.3 Add Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL
https://your-backend.vercel.app/api
```

**⚠️ IMPORTANT**: Replace `your-backend.vercel.app` with the actual URL from Step 2.5

### 3.4 Deploy Admin Dashboard

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://your-admin.vercel.app`
4. **SAVE THIS URL**

### 3.5 Test Admin Dashboard

1. Visit: `https://your-admin.vercel.app`
2. You should see the login page
3. Try logging in with: `admin@amfashions.com` / `admin123`

---

## STEP 4: Deploy Main Website (Port 3000 → Vercel)

### 4.1 Import Main Website to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository: `am-fashions/aaaaaa`
4. **IMPORTANT**: Set Root Directory to `.` (root - leave empty)
5. Click "Continue"

### 4.2 Configure Website Settings

**Framework Preset**: Create React App
**Build Command**: `npm run build`
**Output Directory**: `build`
**Install Command**: `npm install`

### 4.3 Add Environment Variables

Click "Environment Variables" and add:

```
REACT_APP_API_URL
https://your-backend.vercel.app/api
```

**⚠️ IMPORTANT**: Replace `your-backend.vercel.app` with the actual URL from Step 2.5

### 4.4 Deploy Main Website

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://your-website.vercel.app`
4. **SAVE THIS URL**

### 4.5 Test Main Website

1. Visit: `https://your-website.vercel.app`
2. You should see the homepage with products
3. Try adding items to cart

---

## STEP 5: Update CORS Settings

Now that all apps are deployed, we need to update the backend to allow requests from the new URLs.

### 5.1 Update Backend CORS

1. Go to your backend project in Vercel
2. Go to Settings → Environment Variables
3. Add two new variables:

```
FRONTEND_URL
https://your-website.vercel.app

ADMIN_URL
https://your-admin.vercel.app
```

**⚠️ IMPORTANT**: Replace with your actual URLs from Steps 3.4 and 4.4

### 5.2 Redeploy Backend

1. Go to Deployments tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"
4. Wait for redeployment to complete

---

## STEP 6: Custom Domains (Optional)

### 6.1 Add Custom Domain to Website

1. Go to your website project in Vercel
2. Click Settings → Domains
3. Add your domain (e.g., `amfashions.com`)
4. Follow Vercel's DNS instructions
5. Wait for DNS propagation (5-30 minutes)

### 6.2 Add Custom Domain to Admin

1. Go to your admin project in Vercel
2. Click Settings → Domains
3. Add subdomain (e.g., `admin.amfashions.com`)
4. Follow DNS instructions

### 6.3 Add Custom Domain to Backend

1. Go to your backend project in Vercel
2. Click Settings → Domains
3. Add subdomain (e.g., `api.amfashions.com`)
4. Follow DNS instructions

### 6.4 Update Environment Variables

After adding custom domains, update:

**Admin Dashboard**:
```
VITE_API_URL=https://api.amfashions.com/api
```

**Main Website**:
```
REACT_APP_API_URL=https://api.amfashions.com/api
```

**Backend**:
```
FRONTEND_URL=https://amfashions.com
ADMIN_URL=https://admin.amfashions.com
```

Then redeploy all three projects.

---

## 📝 Summary of Your Deployed URLs

After completing all steps, you'll have:

| Component | Vercel URL | Custom Domain (Optional) |
|-----------|-----------|--------------------------|
| Main Website | `https://your-website.vercel.app` | `https://amfashions.com` |
| Admin Dashboard | `https://your-admin.vercel.app` | `https://admin.amfashions.com` |
| Backend API | `https://your-backend.vercel.app` | `https://api.amfashions.com` |

---

## ✅ Testing Checklist

After deployment, test these:

### Main Website
- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Can add items to cart
- [ ] Can place an order
- [ ] Payment screenshot upload works
- [ ] Email notifications received

### Admin Dashboard
- [ ] Login page loads
- [ ] Can login with admin credentials
- [ ] Dashboard shows statistics
- [ ] Can view orders
- [ ] Can view customers
- [ ] Can manage products
- [ ] Payment verification works

### Backend API
- [ ] Health check works: `/api/health`
- [ ] Database connection successful
- [ ] API endpoints respond correctly
- [ ] CORS allows frontend requests
- [ ] Email service works

---

## 🐛 Troubleshooting

### Issue: "Network Error" or "CORS Error"

**Solution**: 
1. Check backend environment variables include `FRONTEND_URL` and `ADMIN_URL`
2. Redeploy backend after adding these variables
3. Clear browser cache

### Issue: "Database Connection Failed"

**Solution**:
1. Verify `DATABASE_URL` is correct in backend environment variables
2. Check Supabase project is active
3. Ensure Supabase allows connections from Vercel IPs (it should by default)

### Issue: "Build Failed" on Vercel

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure `package.json` has correct scripts
3. Verify all dependencies are listed in `package.json`
4. Try deploying again

### Issue: Admin Dashboard Shows Blank Page

**Solution**:
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly
3. Ensure backend URL is accessible
4. Check backend CORS settings

### Issue: Email Not Sending

**Solution**:
1. Verify Gmail App Password is correct
2. Check all email environment variables are set
3. Test with a simple order
4. Check backend logs in Vercel

---

## 🔄 Updating Your Deployed Apps

### When You Make Code Changes:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Deployment**:
   - Vercel automatically detects the push
   - All three apps redeploy automatically
   - Wait 2-3 minutes for deployment

3. **Manual Redeploy** (if needed):
   - Go to Vercel dashboard
   - Select the project
   - Go to Deployments
   - Click "Redeploy" on latest deployment

---

## 💰 Cost Breakdown

### Vercel (FREE Tier)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Serverless functions
- **Cost**: $0/month

### Supabase (FREE Tier)
- ✅ 500 MB database
- ✅ 2 GB file storage
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- **Cost**: $0/month

### Gmail (FREE)
- ✅ Email notifications
- **Cost**: $0/month

**Total Monthly Cost**: $0 🎉

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables
4. Test backend health endpoint
5. Contact: madasumiteesh@gmail.com

---

## 🎉 Congratulations!

Your AM Fashions e-commerce platform is now live and accessible worldwide!

**Next Steps**:
1. Share your website URL with customers
2. Test all features thoroughly
3. Monitor orders in admin dashboard
4. Set up custom domain (optional)
5. Add more products
6. Start selling! 🚀
