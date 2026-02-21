# Stock Update Guide - How to Update Stock Properly

## ✅ FIXED: Stock Updates Now Work in Edit Mode!

The stock update issue has been fixed. You can now edit products and update variant stock directly.

---

## How to Update Stock (Step by Step)

### Method 1: Edit Product and Update Variant Stock

1. **Go to Inventory** in admin dashboard
2. **Find the product** you want to update
3. **Click "Edit"** button on the product card
4. **Scroll to "Variants (Colors & Sizes)"** section
5. **Find the variant** you want to update (e.g., Black, M)
6. **Change the stock quantity** in the "Stock" field
7. **Click "Update Product"** at the bottom
8. **Done!** Stock is updated

### Method 2: Add New Variants

1. Click "Edit" on a product
2. Scroll to "Variants" section
3. Click "Add Variant" button
4. Select color, size, enter stock quantity
5. Click "Update Product"
6. New variant is added with the stock you specified

---

## Understanding How Stock Works

### Stock is Per Variant
- Each color + size combination has its own stock
- Example product with variants:
  - Black, M → Stock: 10
  - Black, L → Stock: 5
  - Blue, M → Stock: 8
  - Blue, L → Stock: 3

### On Customer Website
When a customer:
1. Clicks on a product
2. Selects "Black" color
3. Selects "M" size
4. They see: "10 in stock"

If they select "Blue" + "L", they see: "3 in stock"

---

## What Was Fixed

### Before (Not Working):
- ❌ Edit product → Change variant stock → Save → Stock doesn't update
- ❌ Had to delete variant and re-add it
- ❌ Very inconvenient

### After (Working Now):
- ✅ Edit product → Change variant stock → Save → Stock updates immediately
- ✅ Can also update color, size, price adjustment
- ✅ Can add new variants
- ✅ Can update bulk pricing
- ✅ All changes save properly

---

## Example: Update Stock for "Black T-Shirt, Size M"

**Step-by-Step:**

1. Go to Inventory
2. Find "Black T-Shirt" product
3. Click "Edit"
4. See variants list:
   ```
   Black | M | Stock: 10 | Price: 0
   Black | L | Stock: 5  | Price: 0
   Blue  | M | Stock: 8  | Price: 50
   ```
5. Change Black, M stock from 10 to 25
6. Click "Update Product"
7. Success! Stock is now 25

**Verify on Website:**
1. Go to customer website
2. Find "Black T-Shirt"
3. Click to open product modal
4. Select Black color
5. Select M size
6. Should show: "25 in stock" ✅

---

## Troubleshooting

### Stock Not Showing on Website?

**Check 1: Did you select the right variant?**
- Make sure you select the exact color and size you updated
- Stock is per variant, not per product

**Check 2: Hard refresh the website**
- Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- This clears browser cache

**Check 3: Wait for deployment**
- After saving, wait 1-2 minutes for Vercel to deploy
- Check deployment status in Vercel dashboard

**Check 4: Verify in admin dashboard**
- Edit the product again
- Check if the stock value is saved correctly
- If not, there might be a validation error

### Stock Shows Wrong Number?

**Possible causes:**
1. **Multiple variants with same color/size** - Check if you accidentally created duplicates
2. **Browser cache** - Hard refresh (Ctrl+Shift+R)
3. **Wrong variant selected** - Make sure you're looking at the right color+size combo

---

## Tips for Managing Stock

### Tip 1: Use Descriptive Variant Names
- Instead of just "Black, M", add notes in product description
- Example: "Black Cotton, Medium (Chest: 38-40)"

### Tip 2: Keep Stock Updated Regularly
- Update stock after each sale
- Set low stock alerts (future feature)
- Check stock before running promotions

### Tip 3: Use Bulk Pricing for Wholesale
- Add bulk pricing: "10 for ₹5000"
- Customers see discount for buying more
- Stock still managed per variant

### Tip 4: Mark Out of Stock Variants
- Set stock to 0 for out of stock variants
- Variant will show as unavailable on website
- Customers can't select it

---

## Quick Reference

| Action | Steps |
|--------|-------|
| Update stock | Edit product → Change variant stock → Save |
| Add variant | Edit product → Add Variant → Fill details → Save |
| Remove variant | Edit product → Click X on variant → Save |
| Check stock | Edit product → See variants list |
| Verify on website | Open product → Select color+size → Check stock |

---

## What's Next?

Now that stock updates work properly, you can:
1. ✅ Update stock anytime without workarounds
2. ✅ Add new variants easily
3. ✅ Edit variant details (color, size, price)
4. ✅ Manage bulk pricing
5. ✅ All changes reflect on website immediately

**Everything is working!** 🎉

---

## Need Help?

If stock still doesn't update:
1. Check browser console (F12) for errors
2. Verify the variant exists in the product
3. Make sure you clicked "Update Product"
4. Wait 1-2 minutes for deployment
5. Hard refresh the website (Ctrl+Shift+R)

Most issues are solved by hard refreshing the website to clear cache.
