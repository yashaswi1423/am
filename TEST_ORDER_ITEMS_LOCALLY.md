# Test Order Items Locally - Quick Guide

## ✅ Current Status
- XAMPP MySQL is running
- Backend server is running on http://localhost:5000
- Customer website is running on http://localhost:3000
- Admin dashboard is running on http://localhost:3001

## 🔧 What Was Fixed

1. **MySQL Database Wrapper** - Fixed the database connection for local MySQL
2. **Admin Dashboard API** - Now uses local backend (http://localhost:5000) instead of production
3. **Environment Configuration** - Created `.env.local` for local development

## 🧪 How to Test

### Step 1: Place a New Order
1. Open customer website: http://localhost:3000
2. Browse products and add items to cart
3. Click on cart icon
4. Fill in delivery address:
   - Name: Test Customer
   - Email: test@example.com
   - Phone: 9876543210
   - Address: Test Address
5. Click "Proceed to Payment"
6. Click "I've Completed Payment"
7. Enter transaction ID: 123456789012
8. Upload a screenshot (any image)
9. Click "Submit"

### Step 2: Check Admin Dashboard
1. Open admin dashboard: http://localhost:3001
2. Login with admin credentials
3. Go to "Orders" page
4. Find the new order (should be at the top)
5. Click the "eye" icon to view order details

### Step 3: Verify Order Items
You should now see:
- ✅ Product name (e.g., "Special Offer 3")
- ✅ Variant details (Size: M, Color: Black)
- ✅ Quantity
- ✅ Unit price
- ✅ Subtotal

## 🎯 Expected Result

The order details modal should display something like:

```
📦 Order Items

1. Special Offer 3
   🎨 Size: M, Color: Black
   
   Quantity: 1
   Unit Price: ₹999.00
   Subtotal: ₹999.00
```

## ⚠️ If Items Still Don't Show

### Check 1: Backend Logs
Look at the backend server console for errors when creating the order.

### Check 2: Database
Run this command to verify items are in database:
```bash
cd am/admin-dashboard/server
node test-orders.js
```

### Check 3: API Response
Open browser console (F12) in admin dashboard and check the network tab when viewing order details. Look for the response from `/api/orders/{id}` - it should include an `items` array.

### Check 4: Admin Dashboard is Using Local Backend
Check the browser console for this message:
```
Admin Dashboard API URL: http://localhost:5000/api
```

If it shows the Vercel URL instead, the admin dashboard needs to be restarted:
1. Stop the admin dashboard (Ctrl+C in its terminal)
2. Start it again: `npm run dev`

## 🔄 Restart Servers (if needed)

If you need to restart any server:

### Backend Server
```bash
cd am/admin-dashboard/server
npm start
```

### Customer Website
```bash
cd am
npm start
```

### Admin Dashboard
```bash
cd am/admin-dashboard/client
npm run dev
```

## 📊 Database Verification

To check what's in the database directly:
```bash
cd am/admin-dashboard/server
node test-orders.js
```

This will show all orders and their items from the database.

## 🎉 Success Criteria

- [ ] New order appears in admin dashboard
- [ ] Order details show customer information
- [ ] Order items section shows all products
- [ ] Each item shows: name, size, color, quantity, price
- [ ] No "No items found" warning

## 🐛 Troubleshooting

### Issue: Admin dashboard shows production orders
**Solution**: Make sure `.env.local` file exists in `am/admin-dashboard/client/` and restart the admin dashboard.

### Issue: Backend not connecting to MySQL
**Solution**: Make sure XAMPP MySQL is running. Check XAMPP Control Panel.

### Issue: Order created but items missing
**Solution**: Check backend console logs for errors during order creation. The insert might be failing.

## 📝 Files Modified

1. `am/admin-dashboard/client/.env.local` - Created for local development
2. `am/admin-dashboard/client/src/services/api.js` - Updated to use environment variable
3. `am/admin-dashboard/server/config/database-mysql.js` - Fixed MySQL wrapper

## 🚀 Next Steps

After verifying locally:
1. Test the complete order flow
2. Verify payment verification works
3. Test order status updates
4. Check email notifications (if configured)

---

**Note**: The local setup uses MySQL (XAMPP), while production uses PostgreSQL (Supabase). Both should work identically.
