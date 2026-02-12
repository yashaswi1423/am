# Admin Login Fix - Deployment Checklist

## Issues Fixed

1. ✅ Hardcoded `localhost:5000` URLs replaced with environment variables
2. ✅ Admin login now uses `REACT_APP_API_URL` from environment
3. ✅ Payment verification endpoints updated
4. ✅ Admin dashboard API URLs corrected
5. ✅ Email service approval links now use dynamic backend URL

## Files Modified

### Main Website (am/)
- `src/pages/AdminLogin.jsx` - Fixed API URLs to use environment variable
- `src/pages/Cart.jsx` - Fixed payment verification URL
- `.env.production` - Already configured correctly

### Admin Dashboard Client (am/admin-dashboard/client/)
- `src/pages/PaymentVerifications.jsx` - Fixed all API endpoints
- `.env.production` - Updated to point to correct backend URL

### Admin Dashboard Server (am/admin-dashboard/server/)
- `services/emailService.js` - Fixed approval/rejection links
- `.env.example` - Created with required environment variables

## Deployment Steps

### 1. Update Environment Variables on Vercel

#### For Main Website:
```
REACT_APP_API_URL=https://am-fashions-backend.onrender.com/api
```

#### For Admin Dashboard:
```
VITE_API_URL=https://am-fashions-backend.onrender.com/api
```

### 2. Update Environment Variables on Render (Backend)

Add these to your Render service:
```
API_BASE_URL=https://am-fashions-backend.onrender.com
BACKEND_URL=https://am-fashions-backend.onrender.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
ADMIN_EMAIL=admin_email@gmail.com
DATABASE_URL=your_postgresql_connection_string
```

### 3. Redeploy All Services

1. **Redeploy Main Website on Vercel**
   - Go to Vercel dashboard
   - Select your main website project
   - Click "Redeploy" or push changes to trigger deployment

2. **Redeploy Admin Dashboard on Vercel**
   - Go to Vercel dashboard
   - Select your admin dashboard project
   - Click "Redeploy" or push changes to trigger deployment

3. **Redeploy Backend on Render**
   - Go to Render dashboard
   - Select your backend service
   - Click "Manual Deploy" > "Deploy latest commit"

## Testing the Fix

1. **Test Admin Login:**
   - Go to your deployed website
   - Navigate to Admin Login page
   - Enter credentials: `admin` / `admin123`
   - Click "Request Login"
   - Should see "Approval request sent!" message (not network error)

2. **Check Email:**
   - Admin should receive approval email
   - Click approve/reject link
   - Should see success page

3. **Verify Login:**
   - After approval, user should be logged in
   - Should redirect to home page with admin access

## Common Issues

### Issue: Still getting network error
**Solution:** 
- Clear browser cache
- Check Vercel environment variables are set correctly
- Verify backend is running on Render
- Check browser console for actual error

### Issue: Email not sending
**Solution:**
- Verify EMAIL_USER and EMAIL_PASSWORD in Render environment
- Make sure using Gmail App Password (not regular password)
- Check ADMIN_EMAIL is correct

### Issue: Approval link not working
**Solution:**
- Verify API_BASE_URL is set in Render environment
- Check database has login_requests table
- Verify backend is accessible at the URL

## Verification Commands

Check if backend is running:
```bash
curl https://am-fashions-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "Connected"
}
```

## Next Steps

After deployment:
1. Test admin login flow end-to-end
2. Verify email approval works
3. Test payment verification (if applicable)
4. Monitor Render logs for any errors
5. Check Vercel deployment logs

## Support

If issues persist:
1. Check Render logs: Dashboard > Your Service > Logs
2. Check Vercel logs: Dashboard > Your Project > Deployments > View Function Logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
