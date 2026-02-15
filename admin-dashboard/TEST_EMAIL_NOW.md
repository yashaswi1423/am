# Quick Test: Payment Confirmation Email

## Test Right Now (5 minutes)

### Option 1: Test Locally

1. **Start backend server**:
   ```bash
   cd admin-dashboard/server
   npm start
   ```

2. **Test email configuration**:
   Open browser: `http://localhost:5000/api/test-email`
   
   Should see:
   ```json
   {"success": true, "message": "Email configuration is valid"}
   ```

3. **Submit a test payment**:
   - Go to your website
   - Add item to cart
   - Go to payment page
   - Fill in details with YOUR email address
   - Upload any screenshot
   - Submit

4. **Verify the payment**:
   - Login to admin dashboard
   - Go to "Payment Verifications"
   - Click "Review Payment"
   - Click "Verify Payment"
   - Check alert message

5. **Check your email**:
   - Look in inbox (and spam folder)
   - Should receive confirmation email

### Option 2: Test on Production (Vercel)

**First, ensure environment variables are set in Vercel:**

1. Go to Vercel Dashboard
2. Select backend project (admin-dashboard server)
3. Settings → Environment Variables
4. Add if not present:
   ```
   EMAIL_USER=madasumiteesh@gmail.com
   EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
   ADMIN_EMAIL=madasumiteesh@gmail.com
   ```
5. Redeploy

**Then test:**

1. Visit: `https://your-backend.vercel.app/api/test-email`
2. Should see: `{"success": true}`
3. Submit test payment from live website
4. Verify in admin dashboard
5. Check email

## Debugging Steps

### If email not received:

1. **Check server logs** (Vercel → Functions → Logs):
   Look for:
   ```
   📧 Sending email to: customer@email.com
   ✅ Payment confirmation email sent
   ```

2. **Check verification has email**:
   In your database, run:
   ```sql
   SELECT customer_email FROM payment_verifications 
   ORDER BY created_at DESC LIMIT 1;
   ```
   
   If NULL → Customer didn't enter email in payment form

3. **Check spam folder**

4. **Try different email address**

5. **Check Gmail App Password is valid**:
   - Go to: https://myaccount.google.com/apppasswords
   - Generate new password if needed
   - Update `.env` and Vercel environment variables

## What You Should See

### In Admin Dashboard:
When you click "Verify Payment", you should see:
```
✅ Payment verified and confirmation email sent to customer!
```

Or if email failed:
```
⚠️ Payment verified but email failed to send. Please notify customer manually.
```

### In Customer Email:
Subject: **✅ Payment Confirmed - Order #ORD-XXXXX**

Content includes:
- Payment success message
- Order ID
- Transaction ID
- Amount paid
- Verification date/time
- Next steps
- Support info

### In Server Logs:
```
📋 Verification details: { id: X, email: 'customer@email.com', ... }
📧 Preparing to send payment confirmation email...
📧 Sending email to: customer@email.com
📧 Attempting to send payment confirmation email to: customer@email.com
✅ Payment confirmation email sent successfully to: customer@email.com
```

## Quick Fix Checklist

- [ ] Backend server is running
- [ ] Email credentials in `.env` file
- [ ] `/api/test-email` returns success
- [ ] Customer email is filled in payment form
- [ ] Clicked "Verify Payment" in admin dashboard
- [ ] Checked spam folder
- [ ] Checked server logs
- [ ] Vercel env variables set (production)

## Still Not Working?

1. **Check the exact error** in server logs
2. **Verify customer email** in database
3. **Test with your own email** first
4. **Regenerate Gmail App Password**
5. **Check Vercel function logs** for production

## Expected Timeline

- Email should arrive within **30 seconds** of clicking "Verify Payment"
- If not in inbox, check spam folder
- If not in spam, check server logs for errors
