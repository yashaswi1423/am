# Email Troubleshooting Guide

## Issue: Not Receiving Payment Confirmation Emails

### Step 1: Verify Email Configuration

Check your `.env` file in `admin-dashboard/server/.env`:

```env
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com
```

✅ **Current Status**: Email credentials are configured

### Step 2: Test Email Connection

1. **Start your backend server locally**:
   ```bash
   cd admin-dashboard/server
   npm start
   ```

2. **Test email configuration**:
   Open browser and visit:
   ```
   http://localhost:5000/api/test-email
   ```

   Expected response:
   ```json
   {
     "success": true,
     "message": "Email configuration is valid"
   }
   ```

   If you get an error, check:
   - Gmail App Password is correct (16 characters, no spaces)
   - Gmail account has 2FA enabled
   - App Password is generated from: https://myaccount.google.com/apppasswords

### Step 3: Check Server Logs

When you click "Verify Payment", check the server console for:

```
📧 Preparing to send payment confirmation email...
📧 Sending email to: customer@email.com
✅ Payment confirmation email sent successfully to: customer@email.com
```

If you see errors:
```
❌ Failed to send payment confirmation email: [error message]
```

Common errors and solutions:

#### Error: "Invalid login"
- **Solution**: Regenerate Gmail App Password
- Go to: https://myaccount.google.com/apppasswords
- Create new app password
- Update `.env` file

#### Error: "Customer email not found"
- **Solution**: Customer email is missing in payment verification
- Check database: `payment_verifications` table should have `customer_email` column
- Ensure customer enters email when submitting payment

### Step 4: Verify Database Schema

Check if `payment_verifications` table has customer email:

```sql
SELECT 
  verification_id,
  order_id,
  customer_name,
  customer_email,
  verification_status
FROM payment_verifications
WHERE verification_status = 'pending';
```

If `customer_email` is NULL or empty:
- Customer didn't provide email during payment submission
- Frontend form needs to capture email
- Check `am/src/pages/Payment.jsx` form

### Step 5: Production Deployment (Vercel)

For production, you need to set environment variables in Vercel:

1. Go to Vercel Dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add these variables:

```
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com
```

5. Redeploy the backend

### Step 6: Manual Test

You can manually test the email function:

1. **Create a test verification**:
   Submit a payment from the frontend

2. **Check the verification record**:
   ```sql
   SELECT * FROM payment_verifications 
   ORDER BY created_at DESC LIMIT 1;
   ```

3. **Verify the payment via API**:
   ```bash
   curl -X POST http://localhost:5000/api/payment-verification/[ID]/verify \
     -H "Content-Type: application/json" \
     -d '{"admin_id": 1, "admin_notes": "Test verification"}'
   ```

4. **Check email inbox** (customer email from verification record)

### Step 7: Check Email Spam Folder

Sometimes confirmation emails go to spam:
- Check customer's spam/junk folder
- Add sender email to contacts
- Mark as "Not Spam"

### Step 8: Email Delivery Logs

Check server logs for detailed email sending information:

```
📧 Creating email transporter...
📧 Email user: madasumiteesh@gmail.com
📧 Has password: true
✅ Email transporter created
📧 Attempting to send payment confirmation email to: customer@email.com
✅ Payment confirmation email sent: [message-id]
```

## Quick Checklist

- [ ] Email credentials in `.env` file
- [ ] Gmail App Password is valid (16 chars)
- [ ] 2FA enabled on Gmail account
- [ ] Backend server is running
- [ ] `/api/test-email` returns success
- [ ] Customer email is captured in payment form
- [ ] Database has customer_email in payment_verifications
- [ ] Server logs show email sending attempt
- [ ] Check spam folder
- [ ] Vercel environment variables set (production)

## Common Issues

### Issue: Email not sending in production (Vercel)

**Solution**:
1. Check Vercel environment variables are set
2. Check Vercel function logs for errors
3. Ensure backend is deployed and running
4. Test with `/api/test-email` endpoint

### Issue: Email takes long time to arrive

**Solution**:
- Gmail may have delays (usually < 1 minute)
- Check spam folder
- Verify email address is correct
- Check server logs for sending confirmation

### Issue: Wrong email address

**Solution**:
- Verify customer entered correct email in payment form
- Check database record: `SELECT customer_email FROM payment_verifications WHERE verification_id = X`
- Update if needed: `UPDATE payment_verifications SET customer_email = 'correct@email.com' WHERE verification_id = X`

## Testing Workflow

1. **Submit test payment** from frontend with valid email
2. **Login to admin dashboard**
3. **Go to Payment Verifications**
4. **Click "Review Payment"** on pending verification
5. **Click "Verify Payment"**
6. **Check alert message**: Should say "✅ Payment verified and confirmation email sent to customer!"
7. **Check customer email inbox** (and spam folder)
8. **Check server logs** for email sending confirmation

## Support

If emails still not working after following this guide:

1. Check server console logs
2. Test `/api/test-email` endpoint
3. Verify Gmail App Password
4. Check customer email is valid
5. Try with different email address
6. Check Vercel function logs (production)

## Email Template Preview

The customer receives:
- **Subject**: ✅ Payment Confirmed - Order #[ORDER_ID]
- **Content**:
  - Payment success message
  - Order ID
  - Transaction ID
  - Amount paid
  - Verification timestamp
  - Next steps
  - Support information
