# 📦 How to Add Products in Admin Dashboard

## Quick Guide

### Step 1: Open the Add Product Form
1. Go to **Inventory** page in admin dashboard
2. Click the **"Add Product"** button (blue button with + icon)

### Step 2: Fill Required Fields (IMPORTANT!)

⚠️ **You MUST fill these 3 fields first:**

1. **Product Name** (Required)
   - Example: "Classic White T-Shirt"
   - Must not be empty

2. **Category** (Required)
   - Select from dropdown
   - Options: T-Shirts, Shirts, Cargo, Shorts, Track pants, Coats, Wallets, Jackets, Trousers, Night wear, Hoodies, Gym wear, Sleepwear sets, Sweatshirts, Jeans

3. **Base Price** (Required)
   - Example: 299
   - Must be a number greater than 0
   - Enter in rupees (₹)

### Step 3: Optional Fields

These are optional and can be added later:

- **Description** - Product details
- **Product Images** - Upload files or add URLs
- **Variants** - Colors, sizes, and stock quantities
- **Is Active** - Checkbox to make product visible on website

### Step 4: Create Product

1. Scroll to the bottom of the form
2. Click **"Create Product"** button (blue button)
3. Wait for success message

---

## Common Errors

### ❌ "Product name, category, and base price are required"

**Problem:** You didn't fill in all three required fields

**Solution:** 
1. Scroll to the TOP of the modal
2. Make sure all three fields have values:
   - Product Name is not empty
   - Category is selected
   - Base Price is a valid number > 0

### ❌ "Failed to save product: kickError: Required field"

**Problem:** Same as above - missing required fields

**Solution:** Fill in Product Name, Category, and Base Price

---

## Step-by-Step Example

Let's add a "Classic White T-Shirt":

1. **Click "Add Product"**

2. **Fill in required fields:**
   ```
   Product Name: Classic White T-Shirt
   Category: T-Shirts
   Base Price: 299
   ```

3. **Optional - Add description:**
   ```
   Description: Comfortable cotton t-shirt perfect for everyday wear
   ```

4. **Optional - Add images:**
   - Click "Upload Image File" and select a file
   - OR paste image URL and click + button

5. **Optional - Add variants:**
   - Click "+ Add Variant"
   - Select Color: White
   - Select Size: M
   - Enter Stock: 50
   - Enter Price Adjustment: 0 (or leave as is)

6. **Click "Create Product"**

7. **Success!** Product is now visible in inventory

---

## Tips

✅ **Fill required fields first** - Don't skip to images/variants
✅ **Images are optional** - You can add them later by editing the product
✅ **Variants are optional** - You can add them later
✅ **Check "Is Active"** - Make sure it's checked if you want customers to see it
✅ **Use clear names** - Make product names descriptive
✅ **Set realistic prices** - Enter prices in rupees (₹)

---

## After Creating Product

Once created, the product will:
- ✅ Appear in the Inventory list
- ✅ Be visible on the main website (if "Is Active" is checked)
- ✅ Be available for customers to purchase
- ✅ Show up in the Products page

You can:
- Edit the product by clicking the "Edit" button
- Delete the product by clicking the "Delete" button
- Add more images by editing the product
- Add more variants by editing the product
- Update stock quantities

---

## Troubleshooting

### Product not showing on website?

1. Check if "Is Active" checkbox is checked
2. Make sure you have at least one image
3. Make sure you have at least one variant with stock > 0
4. Refresh the website

### Can't upload images?

1. Make sure Supabase is configured (check backend .env)
2. Try using image URLs instead
3. Check file size (must be < 5MB)
4. Check file type (must be image: jpg, png, etc.)

### Database connection error?

1. Check if backend server is running
2. Check database configuration in .env
3. Check if database tables exist
4. See backend console for detailed errors

---

## Need Help?

- Check browser console (F12) for detailed errors
- Check backend server logs
- Make sure database is properly configured
- Contact: madasumiteesh@gmail.com

---

**Remember:** Product Name, Category, and Base Price are REQUIRED!
