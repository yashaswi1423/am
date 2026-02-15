# 🚀 Start Testing Your Complete Inventory System

## Current Status
✅ Backend server running on port 5000
✅ Image upload functionality added
✅ Main website integrated with database
✅ Authentication fixed
✅ All systems ready to test

## Quick Start (3 Steps)

### Step 1: Start Admin Dashboard Frontend
Open a new terminal and run:
```bash
cd am/admin-dashboard/client
npm run dev
```
This will open http://localhost:5173

### Step 2: Start Main Website
Open another terminal and run:
```bash
cd am
npm start
```
This will open http://localhost:3000

### Step 3: Test the Complete Flow

#### A. Add a Product in Admin Dashboard
1. Go to http://localhost:5173
2. Login with: `admin` / `admin123`
3. Click "Inventory" in sidebar
4. Click "Add Product" button
5. Fill in details:
   - Name: **Summer T-Shirt**
   - Description: **Comfortable cotton t-shirt**
   - Category: **T-Shirts**
   - Base Price: **299**
   - Keep "Product is active" checked
6. **Upload an image:**
   - Click "Upload Image File" button
   - Select an image from your computer
   - Wait for upload (you'll see a preview)
7. **Add a variant:**
   - Click "Add Variant"
   - Select: Color = Black, Size = M
   - Stock = 10
   - Price adjustment = 0
8. Click "Create Product"
9. You should see your product in the list!

#### B. Verify on Main Website
1. Go to http://localhost:3000
2. You should see your new product!
3. Old hardcoded products should be GONE
4. Click on your product to see details
5. Try adding to cart

#### C. Test Complete Order Flow
1. Add product to cart
2. Click cart icon
3. Fill in customer details:
   - Name: Test Customer
   - Phone: 1234567890
   - Address: Test Address
4. Upload a payment screenshot (any image)
5. Click "Place Order"
6. Order should be submitted successfully

#### D. Check Order in Admin Dashboard
1. Go to http://localhost:5173/orders
2. You should see the new order
3. Click on it to see full details:
   - Customer info
   - Product name and quantity
   - Payment screenshot
   - Total amount
4. You can update order status

## What to Test

### ✅ Image Upload
- [ ] Upload image file works
- [ ] Image appears in product list
- [ ] Image shows on main website
- [ ] Multiple images can be added
- [ ] Images are stored in Supabase

### ✅ Product Management
- [ ] Create product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Active/inactive toggle works
- [ ] Variants can be added
- [ ] Stock management works

### ✅ Main Website Integration
- [ ] Products load from database
- [ ] Only active products show
- [ ] Product images display correctly
- [ ] Product details are correct
- [ ] Add to cart works
- [ ] Checkout works

### ✅ Order System
- [ ] Orders are created successfully
- [ ] Order includes product details
- [ ] Payment screenshot is saved
- [ ] Admin can see order details
- [ ] Order status can be updated
- [ ] Email notifications work (if configured)

## Troubleshooting

### Problem: Images not uploading
**Solution:**
1. Check Supabase Storage bucket exists: `product-images`
2. Go to https://app.supabase.com/project/ghekzhxusoijeolsjnlo/storage/buckets
3. Make sure `product-images` bucket exists
4. Check bucket is public

### Problem: Products not showing on main website
**Solution:**
1. Check product is marked as "active" in admin dashboard
2. Open browser console (F12) and check for errors
3. Make sure backend server is running on port 5000
4. Check API URL in main website: http://localhost:5000/api

### Problem: Can't login to admin dashboard
**Solution:**
1. Clear browser localStorage (F12 → Application → Local Storage → Clear)
2. Refresh page
3. Login again with: `admin` / `admin123`

### Problem: Backend server not running
**Solution:**
```bash
cd am/admin-dashboard/server
npm start
```

## Current Servers Running

1. **Backend API**: http://localhost:5000
   - Status: ✅ Running
   - Database: ✅ Connected to Supabase PostgreSQL
   - Storage: ✅ Connected to Supabase Storage

2. **Admin Dashboard**: http://localhost:5173
   - Status: ⏳ Start with `cd am/admin-dashboard/client && npm run dev`

3. **Main Website**: http://localhost:3000
   - Status: ⏳ Start with `cd am && npm start`

## Next Steps After Testing

Once everything works locally:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Complete inventory system with image upload"
   git push origin main
   ```

2. **Deploy to Production:**
   - Backend: Deploy to Vercel
   - Admin Dashboard: Deploy to Vercel
   - Main Website: Deploy to Vercel
   - Update environment variables

3. **Test in Production:**
   - Add products
   - Place orders
   - Verify everything works

## Need Help?

If something doesn't work:
1. Check browser console for errors (F12)
2. Check backend server logs
3. Check database connection
4. Check Supabase Storage configuration

## Success Checklist

- [ ] Backend server running
- [ ] Admin dashboard running
- [ ] Main website running
- [ ] Can login to admin dashboard
- [ ] Can upload images
- [ ] Can create products
- [ ] Products show on main website
- [ ] Can place orders
- [ ] Orders show in admin dashboard

Once all checked, you're ready to deploy! 🎉
