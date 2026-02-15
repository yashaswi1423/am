# 🔧 FIX INVENTORY SYSTEM - STEP BY STEP

## ❌ PROBLEM
SQL migration failed with error: `column "name" does not exist`

## ✅ SOLUTION
Your existing database has `product_name` column, not `name`. I've fixed both the SQL migration and the backend controller.

---

## 📋 STEPS TO FIX (DO THIS NOW)

### STEP 1: Run the New SQL Migration
1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to your project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**
5. Copy and paste the entire content from: `am/admin-dashboard/database/inventory_system_v2.sql`
6. Click **Run** button
7. You should see success messages

### STEP 2: Create Storage Bucket
1. In Supabase Dashboard, click **Storage** in left sidebar
2. Click **New bucket**
3. Bucket name: `product-images`
4. Make it **Public** (toggle the switch)
5. Click **Create bucket**

### STEP 3: Test Locally
```bash
# Terminal 1 - Start Backend
cd am/admin-dashboard/server
npm start

# Terminal 2 - Start Frontend
cd am/admin-dashboard/client
npm start
```

### STEP 4: Test Adding a Product
1. Open http://localhost:3000 in browser
2. Login to admin dashboard
3. Click **Inventory** in sidebar
4. Click **Add Product** button
5. Fill in:
   - Name: Test Product
   - Description: Test description
   - Category: Clothing
   - Base Price: 299
6. Click **Save**
7. Check if product appears in the list

### STEP 5: Test Adding Images
1. Click on the product you just created
2. Upload 1-2 images
3. Check if images appear

### STEP 6: Test Adding Variants
1. Add a variant:
   - Color: Blue
   - Size: M
   - Stock: 10
2. Click **Save**
3. Check if variant appears

---

## ✅ WHAT WAS FIXED

### 1. SQL Migration (`inventory_system_v2.sql`)
- Works with existing `product_name` column
- Adds missing columns safely
- Won't break existing data

### 2. Backend Controller (`productsController.js`)
- Changed `name` → `product_name` in all queries
- Now matches your database structure

---

## 🚨 IF YOU GET ERRORS

### Error: "Cannot connect to database"
- Check `.env` file has correct `DATABASE_URL`
- Make sure Supabase project is running

### Error: "Storage bucket not found"
- Go back to Step 2 and create the bucket
- Make sure it's named exactly `product-images`
- Make sure it's set to **Public**

### Error: "Cannot read property 'product_name'"
- The SQL migration didn't run properly
- Go back to Step 1 and run it again

---

## 📝 AFTER TESTING SUCCESSFULLY

Once everything works locally:
1. Tell me "it works"
2. I'll help you push to GitHub
3. Then we'll deploy to production

---

## 🎯 EXPECTED RESULT

After following these steps, you should be able to:
- ✅ Add products with name, description, category, price
- ✅ Upload multiple images per product
- ✅ Add variants (colors, sizes, stock)
- ✅ Edit and delete products
- ✅ See all products in inventory page
