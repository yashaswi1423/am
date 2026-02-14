# 🚀 Quick Start - Local Development

## ✅ Everything is Ready!

All servers are running and configured correctly:

### 1. Backend Server ✅
- **URL**: http://localhost:5000
- **Status**: Running
- **Database**: MySQL (XAMPP)
- **Health**: http://localhost:5000/api/health

### 2. Customer Website ✅
- **URL**: http://localhost:3000
- **Status**: Running
- **Purpose**: Customers browse and order products

### 3. Admin Dashboard ✅
- **URL**: http://localhost:3001
- **Status**: Running
- **Purpose**: Manage orders, products, customers
- **API**: Connected to local backend (http://localhost:5000)

## 🧪 Test Order Items Now

### Step 1: Place an Order (2 minutes)
1. Open: http://localhost:3000
2. Click any product
3. Select size and color
4. Click "Add to Cart"
5. Click cart icon (top right)
6. Fill in address:
   - Name: John Doe
   - Email: john@test.com
   - Phone: 9876543210
   - Address: 123 Test Street
7. Click "Proceed to Payment"
8. Click "I've Completed Payment"
9. Enter Transaction ID: 123456789012
10. Upload any image as screenshot
11. Click "Submit"

### Step 2: View in Admin Dashboard (1 minute)
1. Open: http://localhost:3001
2. Login (if not logged in)
3. Click "Orders" in sidebar
4. Find your order (top of list)
5. Click the eye icon 👁️
6. **Verify you see**:
   - Product name
   - Size and color
   - Quantity
   - Price

## ✅ Expected Result

You should see something like:

```
📦 Order Items

1. Special Offer 3
   🎨 Size: M, Color: Black
   
   Quantity: 1
   Unit Price: ₹999.00
   Subtotal: ₹999.00
```

## 🎯 What Was Fixed

1. **MySQL Database** - Fixed connection wrapper
2. **Admin Dashboard** - Now uses local backend
3. **Order Items** - Confirmed they're being saved correctly

## 📊 Verify Database

To see what's in the database:
```bash
cd am/admin-dashboard/server
node test-orders.js
```

## 🔄 Restart Servers (if needed)

### All at once:
```bash
# Terminal 1 - Backend
cd am/admin-dashboard/server
npm start

# Terminal 2 - Customer Website
cd am
npm start

# Terminal 3 - Admin Dashboard
cd am/admin-dashboard/client
npm run dev
```

## 🐛 Quick Troubleshooting

### Problem: Admin shows "No items found"
**Check**: Browser console should show:
```
Admin Dashboard API URL: http://localhost:5000/api
```

If it shows Vercel URL, restart admin dashboard:
```bash
cd am/admin-dashboard/client
npm run dev
```

### Problem: Can't connect to database
**Check**: XAMPP MySQL is running (green in XAMPP Control Panel)

### Problem: Backend not responding
**Check**: Backend server is running on port 5000
```bash
curl http://localhost:5000/api/health
```

## 📝 Important Files

- `am/admin-dashboard/client/.env.local` - Local API configuration
- `am/admin-dashboard/server/.env` - Database credentials
- `am/admin-dashboard/server/test-orders.js` - Database test script

## 🎉 Success!

If you can see order items in the admin dashboard, everything is working correctly!

The same code will work in production with PostgreSQL (Supabase) because the database schema and API are identical.

---

**Need Help?** Check these files:
- `ORDER_ITEMS_FIXED.md` - Detailed explanation of what was fixed
- `TEST_ORDER_ITEMS_LOCALLY.md` - Comprehensive testing guide
- `FIX_ORDER_ITEMS_ISSUE.md` - Troubleshooting guide
