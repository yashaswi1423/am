# 🔧 TROUBLESHOOTING GUIDE - AM FASHIONS

## Common Issues and Solutions

---

## 🗄️ DATABASE ISSUES

### Issue: "Cannot connect to database"

**Symptoms:**
- Backend health check fails
- Error: "Connection refused"
- Error: "Invalid connection string"

**Solutions:**

1. **Check DATABASE_URL format:**
   ```
   postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```
   - Must start with `postgresql://`
   - Password must be correct (no `[YOUR-PASSWORD]` placeholder)
   - No spaces in the URL

2. **Verify in Vercel:**
   - Go to backend project → Settings → Environment Variables
   - Check DATABASE_URL is set correctly
   - Click "Edit" and re-paste if needed

3. **Test in Supabase:**
   - Go to Supabase dashboard
   - Click "SQL Editor"
   - Run: `SELECT 1;`
   - Should return success

4. **Redeploy backend:**
   - Vercel → Deployments → Latest → "..." → Redeploy

---

### Issue: "Tables not found"

**Symptoms:**
- Error: "relation 'products' does not exist"
- Error: "table not found"

**Solutions:**

1. **Verify tables exist:**
   - Supabase → Table Editor
   - Should see 12 tables

2. **Re-run schema:**
   - Supabase → SQL Editor → New query
   - Copy contents of `admin-dashboard/database/postgresql_setup.sql`
   - Paste and click "Run"

3. **Check database name:**
   - Connection string should end with `/postgres`
   - Not `/postgres?schema=public`

---

## 🌐 CORS ERRORS

### Issue: "CORS policy blocked"

**Symptoms:**
- Browser console shows: "Access to fetch at '...' has been blocked by CORS policy"
- Network tab shows failed requests
- Red errors in console

**Solutions:**

1. **Update backend URLs:**
   - Vercel → Backend project → Settings → Environment Variables
   - Update `FRONTEND_URL` to your actual domain
   - Update `ADMIN_URL` to your actual admin URL
   - Click "Save"

2. **Redeploy backend:**
   - Deployments → Latest → "..." → Redeploy

3. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Refresh page

4. **Check server.js CORS config:**
   - Should include your domain in `allowedOrigins` array

---

## 🔐 AUTHENTICATION ISSUES

### Issue: "Admin login not working"

**Symptoms:**
- "Request Login" button does nothing
- No email received
- Error: "Invalid credentials"

**Solutions:**

1. **Check email credentials:**
   - Vercel → Backend → Settings → Environment Variables
   - Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
   - Gmail App Password should be 16 characters (no spaces)

2. **Check spam folder:**
   - Approval emails might go to spam
   - Add sender to contacts

3. **Verify admin exists:**
   - Supabase → Table Editor → admins
   - Should see: `admin@amfashions.com`
   - Password hash should exist

4. **Test email service:**
   - Check backend logs in Vercel
   - Look for email sending errors

5. **Generate new app password:**
   - Google Account → Security → 2-Step Verification → App passwords
   - Generate new password for "Mail"
   - Update in Vercel

---

### Issue: "Token expired" or "Invalid token"

**Symptoms:**
- Clicking approval link shows error
- "Token has expired"
- Redirected to login page

**Solutions:**

1. **Request new login:**
   - Approval links expire after 1 hour
   - Request a new login

2. **Check JWT_SECRET:**
   - Vercel → Backend → Environment Variables
   - Verify `JWT_SECRET` is set
   - Should be same across all deployments

3. **Clear localStorage:**
   - Browser console: `localStorage.clear()`
   - Refresh page

---

## 🚀 DEPLOYMENT ISSUES

### Issue: "Build failed" on Vercel

**Symptoms:**
- Deployment shows red "Failed"
- Build logs show errors
- Site not accessible

**Solutions:**

1. **Check build logs:**
   - Vercel → Deployments → Failed deployment → View logs
   - Look for specific error messages

2. **Common build errors:**

   **"Module not found":**
   - Check `package.json` has all dependencies
   - Run locally: `npm install`
   - Push updated `package-lock.json`

   **"Command not found":**
   - Verify build command in Vercel settings
   - Backend: `npm install`
   - Admin: `npm run build`
   - Website: `npm run build`

   **"Out of memory":**
   - Vercel free tier has memory limits
   - Optimize dependencies
   - Remove unused packages

3. **Verify Root Directory:**
   - Backend: `admin-dashboard/server`
   - Admin: `admin-dashboard/client`
   - Website: `./` (blank)

4. **Check Node version:**
   - Vercel uses Node 18 by default
   - Add to `package.json` if needed:
     ```json
     "engines": {
       "node": "18.x"
     }
     ```

---

### Issue: "Function timeout" or "504 Gateway Timeout"

**Symptoms:**
- API requests take too long
- Error: "Function execution timed out"
- 504 error

**Solutions:**

1. **Optimize database queries:**
   - Add indexes to frequently queried columns
   - Limit result sets with LIMIT clause

2. **Check Supabase connection:**
   - Supabase → Settings → Database → Connection pooling
   - Enable connection pooling

3. **Increase timeout (Pro plan only):**
   - Free tier: 10 seconds max
   - Consider upgrading if needed

---

## 🌍 DOMAIN ISSUES

### Issue: "Domain not working"

**Symptoms:**
- Domain shows "404 Not Found"
- Domain shows "DNS_PROBE_FINISHED_NXDOMAIN"
- Domain not accessible

**Solutions:**

1. **Check DNS propagation:**
   - Go to: https://dnschecker.org
   - Enter your domain
   - Should show Vercel IP: `76.76.21.21`
   - May take 10-60 minutes to propagate

2. **Verify DNS records:**
   - At your domain registrar:
   - A record: `@` → `76.76.21.21`
   - CNAME record: `www` → `cname.vercel-dns.com`

3. **Check Vercel domain settings:**
   - Vercel → Website project → Settings → Domains
   - Domain should show green checkmark
   - If red X, click "Refresh"

4. **Try without www:**
   - If `www.yourdomain.com` doesn't work
   - Try `yourdomain.com`
   - Or vice versa

5. **Clear DNS cache:**
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`

---

## 📱 FRONTEND ISSUES

### Issue: "Products not loading"

**Symptoms:**
- Empty product list
- Loading spinner forever
- Console error: "Failed to fetch"

**Solutions:**

1. **Check API URL:**
   - Website: `.env.production` → `REACT_APP_API_URL`
   - Admin: `.env.production` → `VITE_API_URL`
   - Should match backend URL exactly
   - Must end with `/api`

2. **Test backend directly:**
   - Open: `https://backend-url/api/products`
   - Should return JSON array of products

3. **Check browser console:**
   - Press F12 → Console tab
   - Look for error messages
   - Check Network tab for failed requests

4. **Verify products exist:**
   - Supabase → Table Editor → products
   - Should have product rows
   - If empty, add products manually

5. **Redeploy frontend:**
   - After fixing .env.production
   - Push to GitHub
   - Vercel auto-deploys

---

### Issue: "Images not loading"

**Symptoms:**
- Broken image icons
- Alt text showing instead of images
- 404 errors for images

**Solutions:**

1. **Check image paths:**
   - Images should be in `public/` folder
   - Reference as: `/image-name.jpg` (with leading slash)

2. **Verify images exist:**
   - Check `public/` folder has images
   - File names match exactly (case-sensitive)

3. **Check image URLs in database:**
   - Supabase → products table → image_url column
   - Should be valid URLs or paths

4. **Use external image hosting:**
   - Upload to Imgur, Cloudinary, etc.
   - Use full URLs in database

---

### Issue: "Cart not working"

**Symptoms:**
- Can't add to cart
- Cart shows empty
- Cart count not updating

**Solutions:**

1. **Check localStorage:**
   - Browser console: `localStorage.getItem('cart')`
   - Should show cart data

2. **Clear localStorage:**
   - Console: `localStorage.clear()`
   - Refresh page
   - Try adding to cart again

3. **Check browser console:**
   - Look for JavaScript errors
   - Fix any errors shown

4. **Test in incognito mode:**
   - Rules out extension conflicts
   - Rules out cache issues

---

## 📧 EMAIL ISSUES

### Issue: "Emails not sending"

**Symptoms:**
- No order confirmation emails
- No admin approval emails
- No error messages

**Solutions:**

1. **Check email credentials:**
   - Vercel → Backend → Environment Variables
   - `EMAIL_USER` should be full Gmail address
   - `EMAIL_PASSWORD` should be App Password (16 chars)

2. **Generate new App Password:**
   - Google Account → Security
   - 2-Step Verification must be ON
   - App passwords → Generate new
   - Select "Mail" and "Other"
   - Copy 16-character password (no spaces)
   - Update in Vercel

3. **Check backend logs:**
   - Vercel → Backend → Functions
   - Look for email-related errors
   - Check for "Authentication failed" errors

4. **Test email service:**
   - Try sending test email
   - Check spam folder
   - Verify Gmail account is active

5. **Alternative: Use SendGrid:**
   - Free tier: 100 emails/day
   - More reliable than Gmail
   - Update emailService.js

---

### Issue: "Emails going to spam"

**Symptoms:**
- Emails not in inbox
- Found in spam folder

**Solutions:**

1. **Add sender to contacts:**
   - Add `madasumiteesh@gmail.com` to contacts

2. **Mark as "Not Spam":**
   - Find email in spam
   - Click "Not spam"

3. **Use custom domain email:**
   - Instead of Gmail
   - Use email@yourdomain.com
   - More professional, less likely to be spam

4. **Add SPF/DKIM records:**
   - At domain registrar
   - Improves email deliverability

---

## 💳 PAYMENT ISSUES

### Issue: "Can't upload payment screenshot"

**Symptoms:**
- Upload button doesn't work
- Error: "File too large"
- Image not uploading

**Solutions:**

1. **Check file size:**
   - Max size: 5MB (default Multer limit)
   - Compress image if needed

2. **Check file type:**
   - Allowed: .jpg, .jpeg, .png, .gif
   - Not allowed: .pdf, .doc, etc.

3. **Check backend logs:**
   - Vercel → Backend → Functions
   - Look for upload errors

4. **Verify Multer configuration:**
   - Check `server.js` has Multer setup
   - Check upload directory exists

5. **Test with different image:**
   - Try smaller image
   - Try different format

---

### Issue: "Payment verification not working"

**Symptoms:**
- Can't approve/reject payments
- Status not updating
- Error when clicking buttons

**Solutions:**

1. **Check authentication:**
   - Make sure you're logged in as admin
   - Token might have expired

2. **Check API endpoint:**
   - Should be: `PATCH /api/admin/payments/:id`
   - Verify route exists in backend

3. **Check database:**
   - Supabase → payment_verifications table
   - Verify records exist

4. **Check browser console:**
   - Look for API errors
   - Check Network tab

---

## 🔍 DEBUGGING TIPS

### How to Check Backend Logs

1. Vercel → Backend project
2. Click "Functions" tab
3. Click on any function
4. See real-time logs
5. Look for errors in red

### How to Check Frontend Errors

1. Open website
2. Press F12 (Developer Tools)
3. Click "Console" tab
4. Look for red errors
5. Click "Network" tab to see API calls

### How to Test API Endpoints

**Using Browser:**
```
https://backend-url/api/health
https://backend-url/api/products
```

**Using Postman:**
1. Download Postman
2. Create new request
3. Set method (GET, POST, etc.)
4. Enter URL
5. Add headers if needed
6. Send request

**Using curl:**
```bash
curl https://backend-url/api/health
curl https://backend-url/api/products
```

### How to Check Database

1. Supabase → Table Editor
2. Click table name
3. See all rows
4. Click "Insert row" to add data
5. Click row to edit

### How to Check Environment Variables

**Vercel:**
1. Project → Settings → Environment Variables
2. See all variables
3. Click "Edit" to update
4. Click "Add" to add new

**Local:**
1. Check `.env` file
2. Make sure no spaces around `=`
3. No quotes needed for values

---

## 🆘 Still Having Issues?

### Before Asking for Help

1. **Check all the above solutions**
2. **Clear browser cache**
3. **Try incognito mode**
4. **Check browser console for errors**
5. **Check Vercel logs**
6. **Check Supabase dashboard**

### What to Include When Asking for Help

1. **Exact error message** (copy-paste)
2. **Screenshot of error**
3. **What you were trying to do**
4. **What you've already tried**
5. **Browser console errors** (F12 → Console)
6. **Vercel logs** (if backend issue)

### Contact

- **Email:** madasumiteesh@gmail.com
- **Include:** All information above

---

## 📚 Useful Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **React Docs:** https://react.dev
- **Express Docs:** https://expressjs.com
- **Node.js Docs:** https://nodejs.org/docs

---

## 🎯 Prevention Tips

1. **Always test locally first**
2. **Check environment variables before deploying**
3. **Keep dependencies updated**
4. **Monitor Vercel logs regularly**
5. **Check Supabase usage dashboard**
6. **Backup database regularly** (Supabase → Database → Backups)
7. **Test in multiple browsers**
8. **Test on mobile devices**

---

**Most issues can be solved by:**
1. Checking environment variables
2. Redeploying
3. Clearing cache
4. Checking logs

**Good luck!** 🚀
