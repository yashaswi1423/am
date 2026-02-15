# Deployment Checklist - Email-Based Admin Login

## Pre-Deployment

### 1. Gmail Setup
- [ ] Create/use Gmail account for sending emails
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password (https://myaccount.google.com/apppasswords)
- [ ] Save the 16-character app password

### 2. Database Setup
- [ ] Choose database hosting (PlanetScale, Railway, AWS RDS, etc.)
- [ ] Create MySQL database
- [ ] Note down connection details (host, user, password, database name)
- [ ] Run `mysql_complete_setup.sql` on production database
- [ ] Run `add_login_requests_mysql.sql` on production database

### 3. Backend Deployment (Render/Railway)
- [ ] Create new web service
- [ ] Connect GitHub repository
- [ ] Set root directory to `admin-dashboard/server`
- [ ] Add environment variables:
  - [ ] `DB_HOST`
  - [ ] `DB_USER`
  - [ ] `DB_PASSWORD`
  - [ ] `DB_NAME`
  - [ ] `DB_PORT` (usually 3306)
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASSWORD` (16-char app password)
  - [ ] `ADMIN_EMAIL`
  - [ ] `API_BASE_URL` (your backend URL)
  - [ ] `BACKEND_URL` (your backend URL)
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
- [ ] Deploy and note the backend URL

### 4. Admin Dashboard Frontend (Vercel)
- [ ] Create new Vercel project
- [ ] Set root directory to `admin-dashboard/client`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = `https://your-backend-url.com/api`
- [ ] Deploy and note the admin dashboard URL

### 5. Main Website Frontend (Vercel)
- [ ] Create new Vercel project
- [ ] Set root directory to `am`
- [ ] Add environment variable:
  - [ ] `REACT_APP_API_URL` = `https://your-backend-url.com/api`
- [ ] Deploy and note the website URL

## Post-Deployment Testing

### 1. Test Backend Health
- [ ] Visit: `https://your-backend-url.com/api/health`
- [ ] Should return: `{"status":"OK","database":"Connected"}`

### 2. Test Email Configuration
- [ ] Visit: `https://your-backend-url.com/api/test-email`
- [ ] Should return: `{"success":true,"message":"Email configuration is valid"}`

### 3. Test Admin Login Flow
- [ ] Visit: `https://your-admin-dashboard-url.com`
- [ ] Click on admin login or navigate to login page
- [ ] Enter credentials: `admin` / `admin123`
- [ ] Click "Request Login"
- [ ] Check email inbox (ADMIN_EMAIL)
- [ ] Should receive approval email within 1 minute
- [ ] Click "APPROVE LOGIN" button in email
- [ ] Should see success page
- [ ] Go back to login page - should be approved
- [ ] User should be able to access dashboard

### 4. Test Dashboard Access
- [ ] After approval, access admin dashboard
- [ ] Check if all pages load (Dashboard, Orders, Products, etc.)
- [ ] Verify API calls are working

## Environment Variables Summary

### Backend (.env)
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ecommerce_admin
DB_PORT=3306
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin_email@gmail.com
API_BASE_URL=https://your-backend.com
BACKEND_URL=https://your-backend.com
NODE_ENV=production
PORT=5000
```

### Admin Dashboard Client (.env.production)
```
VITE_API_URL=https://your-backend.com/api
```

### Main Website (.env.production)
```
REACT_APP_API_URL=https://your-backend.com/api
```

## Common Issues & Solutions

### Email Not Sending
**Problem:** Email approval not received
**Solution:**
1. Check Gmail App Password is correct (16 chars, no spaces)
2. Verify EMAIL_USER matches Gmail account
3. Test `/api/test-email` endpoint
4. Check server logs for email errors

### Database Connection Failed
**Problem:** Backend can't connect to database
**Solution:**
1. Verify DB_HOST, DB_USER, DB_PASSWORD are correct
2. Check database is accessible from hosting platform
3. Ensure database exists and tables are created
4. Check firewall rules allow connection

### Approval Links Not Working
**Problem:** Clicking approve/reject does nothing
**Solution:**
1. Verify API_BASE_URL matches actual backend URL
2. Check backend server is running
3. Ensure login_requests table exists in database

### CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:**
1. Backend already has CORS enabled for all origins
2. If still issues, check VITE_API_URL / REACT_APP_API_URL is correct
3. Ensure backend URL is accessible

## Security Notes

- ✅ Login requests expire after 10 minutes
- ✅ Each approval token can only be used once
- ✅ Email approval required for every login
- ✅ Admin can reject suspicious login attempts
- ⚠️ Change default admin credentials in production
- ⚠️ Keep Gmail App Password secure
- ⚠️ Don't commit .env files to Git

## Deployment Platforms Tested

✅ **Backend:** Render, Railway, Heroku
✅ **Frontend:** Vercel, Netlify
✅ **Database:** PlanetScale, Railway MySQL, AWS RDS

## Support

If you encounter issues:
1. Check server logs on hosting platform
2. Verify all environment variables
3. Test email endpoint
4. Check database connection
5. Review this checklist again

---

**Ready to Deploy?** Follow this checklist step by step and your email-based admin login will work perfectly in production! 🚀
