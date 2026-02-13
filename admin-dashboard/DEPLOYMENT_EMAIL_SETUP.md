# Email-Based Admin Login - Deployment Guide

## Overview
The admin login system uses email approval for security. When someone tries to log in, an email is sent to the admin with approve/reject links.

## How It Works

1. User enters username and password on admin login page
2. System sends approval email to admin
3. Admin clicks "APPROVE" or "REJECT" in email
4. User gets access (or denied) based on admin's decision

## Environment Variables Required

### For Backend Server (Admin Dashboard Server)

Create a `.env` file in `admin-dashboard/server/` with:

```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=ecommerce_admin
DB_PORT=3306

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
ADMIN_EMAIL=admin_email@gmail.com

# API Configuration
API_BASE_URL=https://your-backend-domain.com
BACKEND_URL=https://your-backend-domain.com

# Server Configuration
PORT=5000
NODE_ENV=production
```

### For Frontend (Admin Dashboard Client)

Create a `.env.production` file in `admin-dashboard/client/` with:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### For Main Website

Create a `.env.production` file in the root `am/` folder with:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Gmail App Password Setup

To send emails, you need a Gmail App Password (not your regular password):

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. After enabling 2FA, go back to Security
5. Click on "App passwords" (you'll see this only after 2FA is enabled)
6. Select "Mail" and "Other (Custom name)"
7. Enter "Admin Dashboard" as the name
8. Click "Generate"
9. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
10. Use this password in `EMAIL_PASSWORD` environment variable

## Hosting Platform Configuration

### Vercel (Recommended for Frontend)

1. **Deploy Admin Dashboard Client:**
   ```bash
   cd admin-dashboard/client
   vercel
   ```

2. **Add Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-domain.com/api`

3. **Deploy Main Website:**
   ```bash
   cd am
   vercel
   ```

4. **Add Environment Variables:**
   - Add: `REACT_APP_API_URL` = `https://your-backend-domain.com/api`

### Render/Railway (Recommended for Backend)

1. **Deploy Backend Server:**
   - Connect your GitHub repository
   - Set root directory to `admin-dashboard/server`
   - Add all environment variables from above

2. **Important Environment Variables:**
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=ecommerce_admin
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ADMIN_EMAIL=admin_email@gmail.com
   API_BASE_URL=https://your-backend-domain.com
   NODE_ENV=production
   ```

### Database Hosting

#### Option 1: PlanetScale (MySQL - Free Tier Available)
1. Create account at https://planetscale.com/
2. Create new database
3. Get connection string
4. Use connection details in `DB_HOST`, `DB_USER`, `DB_PASSWORD`

#### Option 2: Railway MySQL
1. Add MySQL plugin in Railway
2. Copy connection details
3. Use in environment variables

#### Option 3: AWS RDS / DigitalOcean Managed MySQL
1. Create MySQL instance
2. Run the setup SQL script:
   ```bash
   mysql -h your_host -u your_user -p your_database < admin-dashboard/database/mysql_complete_setup.sql
   ```

## Database Setup on Production

After deploying, run these SQL scripts on your production database:

1. **Main Schema:**
   ```bash
   mysql -h your_host -u your_user -p your_database < admin-dashboard/database/mysql_complete_setup.sql
   ```

2. **Login Requests Table:**
   ```bash
   mysql -h your_host -u your_user -p your_database < admin-dashboard/database/add_login_requests_mysql.sql
   ```

## Testing Email Functionality

After deployment, test the email:

1. Visit: `https://your-backend-domain.com/api/test-email`
2. Should return: `{"success":true,"message":"Email configuration is valid"}`
3. If it fails, check your Gmail App Password and EMAIL_USER settings

## Security Checklist

- [ ] Gmail App Password generated and added to environment variables
- [ ] `ADMIN_EMAIL` set to correct email address
- [ ] `API_BASE_URL` points to your actual backend domain
- [ ] Database credentials are secure and not exposed
- [ ] All environment variables added to hosting platform
- [ ] Test email functionality before going live
- [ ] Login requests expire after 10 minutes (built-in security)

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT:** Change these credentials in production by updating the admin login logic or adding proper authentication.

## Troubleshooting

### Email Not Sending
- Check Gmail App Password is correct (16 characters, no spaces)
- Verify 2FA is enabled on Gmail account
- Check `EMAIL_USER` matches the Gmail account
- Test endpoint: `/api/test-email`

### Approval Links Not Working
- Verify `API_BASE_URL` is set correctly
- Check backend server is accessible
- Ensure database has `login_requests` table

### Database Connection Failed
- Verify database credentials
- Check database host is accessible from hosting platform
- Ensure database exists and tables are created

## Production URLs Structure

```
Main Website:        https://your-site.vercel.app
Admin Dashboard:     https://your-admin.vercel.app
Backend API:         https://your-backend.render.com
```

## Email Flow in Production

1. User visits: `https://your-admin.vercel.app/login`
2. Enters credentials and clicks "Request Login"
3. Backend sends email to `ADMIN_EMAIL`
4. Admin receives email with links like:
   - Approve: `https://your-backend.render.com/api/auth/approve-login?token=xxx&action=approve`
   - Reject: `https://your-backend.render.com/api/auth/approve-login?token=xxx&action=reject`
5. Admin clicks approve
6. User can now access dashboard

## Cost Estimate (Free Tier)

- Vercel (Frontend): Free
- Render (Backend): Free tier available
- PlanetScale (Database): Free tier (5GB)
- Gmail: Free
- **Total: $0/month** (with free tiers)

## Support

If you face issues during deployment:
1. Check server logs on hosting platform
2. Verify all environment variables are set
3. Test email configuration endpoint
4. Check database connection

---

**Note:** This system is production-ready and will work exactly the same way when hosted as it does locally. Just ensure all environment variables are properly configured on your hosting platform.
