# Vercel Environment Variables Setup

## Critical: Email Not Sending in Production

The error "Payment verified but email failed to send" means the email service is not configured in Vercel.

## Fix: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Select your **backend project** (admin-dashboard server)
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add These Variables

Add the following environment variables:

#### Email Configuration (REQUIRED)
```
EMAIL_USER
Value: madasumiteesh@gmail.com
```

```
EMAIL_PASSWORD
Value: mnfc xdxe ojpi rtzf
```

```
ADMIN_EMAIL
Value: madasumiteesh@gmail.com
```

#### API Configuration
```
API_BASE_URL
Value: https://your-backend-url.vercel.app
```

```
BACKEND_URL
Value: https://your-backend-url.vercel.app
```

### Step 3: Apply to All Environments

For each variable:
- Check: ✅ Production
- Check: ✅ Preview
- Check: ✅ Development

### Step 4: Redeploy

After adding all variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋯** (three dots)
4. Click **Redeploy**
5. Wait for deployment to complete

## Verify Setup

After redeployment, test:

1. Visit: `https://your-backend-url.vercel.app/api/test-email`
2. Should return: `{"success": true, "message": "Email configuration is valid"}`

If you see an error, check:
- Environment variables are spelled correctly
- No extra spaces in values
- All variables are added
- Deployment completed successfully

## Quick Checklist

- [ ] Logged into Vercel Dashboard
- [ ] Selected correct backend project
- [ ] Added EMAIL_USER variable
- [ ] Added EMAIL_PASSWORD variable
- [ ] Added ADMIN_EMAIL variable
- [ ] Added API_BASE_URL variable
- [ ] Added BACKEND_URL variable
- [ ] Applied to all environments
- [ ] Redeployed the project
- [ ] Tested /api/test-email endpoint
- [ ] Tested payment verification

## Common Issues

### Issue: Variables not taking effect
**Solution**: Redeploy the project after adding variables

### Issue: Still getting email error
**Solution**: 
1. Check Vercel function logs for detailed error
2. Verify Gmail App Password is correct
3. Ensure no spaces in environment variable values
4. Try regenerating Gmail App Password

### Issue: Can't find backend project
**Solution**: 
- Look for project named "admin-dashboard" or similar
- Check project URL matches your backend API
- May be named "am-admin" or "am-server"

## Testing After Setup

1. **Test email config**:
   ```
   https://your-backend-url.vercel.app/api/test-email
   ```

2. **Submit test payment** from website

3. **Verify payment** in admin dashboard

4. **Check for success message**:
   - Should say: "✅ Payment verified and confirmation email sent to customer!"
   - NOT: "⚠️ Payment verified but email failed to send"

5. **Check customer email** (inbox and spam)

## Environment Variables Template

Copy this template for quick setup:

```
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com
API_BASE_URL=https://your-backend-url.vercel.app
BACKEND_URL=https://your-backend-url.vercel.app
```

Replace `your-backend-url` with your actual Vercel backend URL.

## Need Help?

If still not working:
1. Check Vercel function logs (Deployments → Latest → Functions)
2. Look for email-related errors
3. Verify environment variables are visible in Settings
4. Try redeploying again
5. Test with /api/test-email endpoint first
