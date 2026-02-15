# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment of all components.

---

## 📋 Pre-Deployment Checklist

### Before You Start
- [ ] GitHub repository is up to date
- [ ] All code is committed and pushed
- [ ] Supabase database is set up and running
- [ ] You have all environment variables ready
- [ ] Gmail App Password is generated

---

## 🚀 Deployment Steps

### STEP 1: Create Vercel Account
- [ ] Go to https://vercel.com/signup
- [ ] Sign up with GitHub
- [ ] Authorize Vercel to access your repositories

---

### STEP 2: Deploy Backend API

- [ ] Go to https://vercel.com/new
- [ ] Import repository: `am-fashions/aaaaaa`
- [ ] Set Root Directory: `admin-dashboard/server`
- [ ] Framework: Other
- [ ] Add all environment variables:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] DATABASE_URL
  - [ ] PORT
  - [ ] NODE_ENV
  - [ ] JWT_SECRET
  - [ ] EMAIL_HOST
  - [ ] EMAIL_PORT
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASS
  - [ ] EMAIL_FROM
  - [ ] ADMIN_EMAIL
- [ ] Click Deploy
- [ ] Wait for deployment to complete
- [ ] Copy backend URL: `_______________________`
- [ ] Test: Visit `https://your-backend.vercel.app/api/health`
- [ ] Verify response shows "status": "ok"

---

### STEP 3: Deploy Admin Dashboard

- [ ] Go to https://vercel.com/new
- [ ] Import repository: `am-fashions/aaaaaa`
- [ ] Set Root Directory: `admin-dashboard/client`
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Add environment variable:
  - [ ] VITE_API_URL = `https://your-backend.vercel.app/api`
- [ ] Click Deploy
- [ ] Wait for deployment to complete
- [ ] Copy admin URL: `_______________________`
- [ ] Test: Visit admin URL
- [ ] Verify login page loads
- [ ] Try logging in with admin credentials

---

### STEP 4: Deploy Main Website

- [ ] Go to https://vercel.com/new
- [ ] Import repository: `am-fashions/aaaaaa`
- [ ] Set Root Directory: `.` (root/empty)
- [ ] Framework: Create React App
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Add environment variable:
  - [ ] REACT_APP_API_URL = `https://your-backend.vercel.app/api`
- [ ] Click Deploy
- [ ] Wait for deployment to complete
- [ ] Copy website URL: `_______________________`
- [ ] Test: Visit website URL
- [ ] Verify homepage loads with products

---

### STEP 5: Update Backend CORS

- [ ] Go to backend project in Vercel
- [ ] Settings → Environment Variables
- [ ] Add FRONTEND_URL = `https://your-website.vercel.app`
- [ ] Add ADMIN_URL = `https://your-admin.vercel.app`
- [ ] Go to Deployments tab
- [ ] Redeploy latest deployment
- [ ] Wait for redeployment

---

## 🧪 Testing Checklist

### Test Main Website
- [ ] Homepage loads correctly
- [ ] Products display with images
- [ ] Can click on products
- [ ] Can add items to cart
- [ ] Cart shows correct items
- [ ] Can proceed to checkout
- [ ] Can fill shipping information
- [ ] Can upload payment screenshot
- [ ] Order confirmation shows
- [ ] Email notification received

### Test Admin Dashboard
- [ ] Login page loads
- [ ] Can login with: admin@amfashions.com / admin123
- [ ] Dashboard shows statistics
- [ ] Statistics show correct numbers
- [ ] Can navigate to Orders page
- [ ] Orders list displays
- [ ] Can view order details
- [ ] Can navigate to Customers page
- [ ] Customers list displays
- [ ] Can navigate to Products page
- [ ] Products list displays
- [ ] Can navigate to Payment Verifications
- [ ] Pending payments show
- [ ] Can verify/reject payments
- [ ] Analytics page loads
- [ ] Charts display correctly

### Test Backend API
- [ ] Health endpoint works: `/api/health`
- [ ] Returns: `{"status":"ok","database":"connected"}`
- [ ] Orders endpoint works: `/api/orders`
- [ ] Products endpoint works: `/api/products`
- [ ] Customers endpoint works: `/api/customers`
- [ ] No CORS errors in browser console
- [ ] Database queries execute successfully

### Test Email System
- [ ] Place a test order
- [ ] Check if order confirmation email received
- [ ] Verify payment screenshot
- [ ] Check if verification email sent to admin
- [ ] Test admin login approval email

---

## 📝 Record Your URLs

Write down your deployed URLs here:

```
Backend API:     https://_________________________________.vercel.app
Admin Dashboard: https://_________________________________.vercel.app
Main Website:    https://_________________________________.vercel.app
```

---

## 🔧 Post-Deployment Configuration

### Optional: Custom Domains

#### For Main Website
- [ ] Go to website project → Settings → Domains
- [ ] Add domain: `amfashions.com`
- [ ] Follow DNS instructions
- [ ] Wait for DNS propagation (5-30 min)
- [ ] Update REACT_APP_API_URL if needed

#### For Admin Dashboard
- [ ] Go to admin project → Settings → Domains
- [ ] Add domain: `admin.amfashions.com`
- [ ] Follow DNS instructions
- [ ] Wait for DNS propagation
- [ ] Update VITE_API_URL if needed

#### For Backend API
- [ ] Go to backend project → Settings → Domains
- [ ] Add domain: `api.amfashions.com`
- [ ] Follow DNS instructions
- [ ] Wait for DNS propagation
- [ ] Update FRONTEND_URL and ADMIN_URL
- [ ] Redeploy all projects

---

## 🐛 Common Issues & Solutions

### Issue: Build Failed
- [ ] Check build logs in Vercel
- [ ] Verify package.json has build script
- [ ] Check all dependencies are installed
- [ ] Try redeploying

### Issue: CORS Error
- [ ] Verify FRONTEND_URL and ADMIN_URL are set in backend
- [ ] Check URLs don't have trailing slashes
- [ ] Redeploy backend after adding variables
- [ ] Clear browser cache

### Issue: Database Connection Error
- [ ] Verify DATABASE_URL is correct
- [ ] Check Supabase project is active
- [ ] Test connection from Supabase dashboard
- [ ] Check for typos in connection string

### Issue: Environment Variables Not Working
- [ ] Verify variable names are exact (case-sensitive)
- [ ] For Vite: Must start with `VITE_`
- [ ] For React: Must start with `REACT_APP_`
- [ ] Redeploy after adding variables

### Issue: 404 Errors
- [ ] Check Root Directory is set correctly
- [ ] Verify build output directory
- [ ] Check vercel.json configuration
- [ ] Review deployment logs

---

## 📊 Monitoring

### After Deployment, Monitor:
- [ ] Vercel Analytics (free)
- [ ] Error logs in Vercel dashboard
- [ ] Supabase database usage
- [ ] Email delivery success rate
- [ ] Customer orders coming through
- [ ] Admin dashboard accessibility

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ All three URLs are accessible
- ✅ No console errors in browser
- ✅ Can place orders from website
- ✅ Orders appear in admin dashboard
- ✅ Database stores data correctly
- ✅ Emails are being sent
- ✅ Payment verification works
- ✅ All pages load within 3 seconds

---

## 📞 Need Help?

If you encounter issues:
1. Check this checklist again
2. Review COMPLETE_HOSTING_GUIDE.md
3. Check Vercel deployment logs
4. Check browser console for errors
5. Contact: madasumiteesh@gmail.com

---

**Date Deployed**: _______________
**Deployed By**: _______________
**Notes**: _______________________________________________
