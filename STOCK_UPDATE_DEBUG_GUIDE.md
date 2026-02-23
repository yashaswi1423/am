# Stock Update Debugging Guide

## Issue Description
When updating stock for multiple sizes (S:20, M:20, L:20, XL:20), only M:20 is reflecting on the main website.

## Root Cause Analysis

The issue is likely one of the following:

### 1. Missing Variants in Admin Dashboard
**Problem:** Admin might be creating only one variant (M size) instead of creating separate variants for each size.

**Solution:** When editing a product, you MUST create a separate variant row for EACH size/color combination.

**Example - WRONG:**
```
Variant 1: Black - M - Stock: 20
(Only one variant created)
```

**Example - CORRECT:**
```
Variant 1: Black - S - Stock: 20
Variant 2: Black - M - Stock: 20
Variant 3: Black - L - Stock: 20
Variant 4: Black - XL - Stock: 20
(Four separate variants created)
```

### 2. Variants Not Being Saved
**Problem:** Variants might not be saving to the database properly.

**How to Check:**
1. Open Admin Dashboard
2. Edit a product
3. Open browser console (F12)
4. Look for logs that say "=== EDITING PRODUCT ==="
5. Check "Total variants loaded" - should match the number of size/color combinations

### 3. Main Website Not Displaying All Variants
**Problem:** Variants might be in the database but not showing on the website.

**How to Check:**
1. Open main website
2. Open browser console (F12)
3. Look for logs that say "=== PRODUCTS LOADED ==="
4. Find your product and check the variant count
5. Each variant should show: Color, Size, Stock, Available status

## Step-by-Step Fix Instructions

### Step 1: Verify Current State
1. Go to Admin Dashboard → Inventory
2. Click "Edit" on the problematic product
3. Open browser console (F12)
4. Look at the console logs:
   ```
   === EDITING PRODUCT ===
   Product: [Product Name]
   Total variants loaded: X
   Variants detail: [Array of variants]
   ```
5. Count the variants - does it match what you expect?

### Step 2: Add Missing Variants
If you see fewer variants than expected:

1. In the edit modal, scroll to "Variants (Colors & Sizes)" section
2. Click "Add Variant" button for each missing size/color combination
3. Fill in the details:
   - Color: Select from dropdown
   - Size: Select from dropdown
   - Stock: Enter quantity (e.g., 20)
   - Price ±: Leave as 0 unless you want to adjust price
4. Repeat for ALL size/color combinations you want to offer

**Example for a Black T-shirt in 4 sizes:**
- Click "Add Variant" → Black, S, Stock: 20
- Click "Add Variant" → Black, M, Stock: 20
- Click "Add Variant" → Black, L, Stock: 20
- Click "Add Variant" → Black, XL, Stock: 20

### Step 3: Save and Verify
1. Click "Update Product"
2. Check console logs:
   ```
   === UPDATING PRODUCT ===
   Product ID: X
   Total variants to update: 4
   Updating variant: [variant details]
   ...
   === ALL VARIANTS UPDATED ===
   ```
3. Verify all variants were updated

### Step 4: Check Main Website
1. Go to main website
2. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. Open browser console (F12)
4. Look for:
   ```
   === PRODUCTS LOADED ===
   Product: [Your Product], Variants: 4
     - Black S: Stock 20, Available: true
     - Black M: Stock 20, Available: true
     - Black L: Stock 20, Available: true
     - Black XL: Stock 20, Available: true
   ```
5. Click on the product to open the modal
6. Select the color (Black)
7. Verify ALL sizes (S, M, L, XL) are clickable and show stock

## Common Mistakes to Avoid

### ❌ Mistake 1: Updating Only One Variant
Don't just update the stock of one existing variant. You need separate variants for each size.

### ❌ Mistake 2: Not Clicking "Add Variant"
The "Add Variant" button creates a new row. You need to click it multiple times to add multiple variants.

### ❌ Mistake 3: Same Size/Color Combination
Each variant must have a unique size/color combination. Don't create two variants with "Black - M".

### ❌ Mistake 4: Forgetting to Save
After adding all variants, you must click "Update Product" to save changes.

### ❌ Mistake 5: Not Refreshing Main Website
After updating in admin, you need to refresh the main website to see changes.

## Database Verification Query

If you want to check the database directly:

```sql
-- Check all variants for a specific product
SELECT 
    p.product_name,
    pv.variant_id,
    pv.color,
    pv.size,
    pv.stock_quantity,
    pv.is_available,
    pv.price_adjustment
FROM products p
JOIN product_variants pv ON p.product_id = pv.product_id
WHERE p.product_name LIKE '%YOUR_PRODUCT_NAME%'
ORDER BY pv.color, pv.size;
```

Expected result: One row for each size/color combination.

## Still Having Issues?

If you've followed all steps and still see the problem:

1. **Check Browser Cache:**
   - Clear browser cache
   - Try in incognito/private mode

2. **Check API Response:**
   - Open Network tab in browser console
   - Find the request to `/api/products?is_active=true`
   - Check the response - do all variants appear in the JSON?

3. **Check Database:**
   - Run the SQL query above in Supabase
   - Verify variants exist in the database

4. **Check Variant Availability:**
   - In the admin dashboard, make sure each variant has:
     - `is_available` = true (checkbox checked)
     - `stock_quantity` > 0

5. **Contact Support:**
   - Provide console logs from both admin and main website
   - Provide screenshot of the variants section in admin edit modal
   - Provide the SQL query result

## Quick Checklist

Before reporting an issue, verify:

- [ ] I created separate variant rows for each size/color combination
- [ ] Each variant has stock_quantity > 0
- [ ] Each variant has is_available = true
- [ ] I clicked "Update Product" to save
- [ ] I refreshed the main website (hard refresh)
- [ ] I checked browser console for errors
- [ ] I verified variants exist in the database
- [ ] I tried in incognito mode to rule out cache issues

## Debug Logs Location

**Admin Dashboard:**
- Open: Admin Dashboard → Inventory → Edit Product
- Console logs start with: `=== EDITING PRODUCT ===`

**Main Website:**
- Open: Main Website (customer view)
- Console logs start with: `=== PRODUCTS LOADED ===`

## Expected Behavior

**Admin Dashboard:**
- When editing a product with 4 sizes, you should see 4 variant rows
- Each row should have its own color, size, and stock fields
- Updating should show "Total variants to update: 4"

**Main Website:**
- Product modal should show all sizes as clickable buttons
- Selecting a color should show all available sizes for that color
- Each size should display its stock count
- Out of stock sizes should be disabled/grayed out
