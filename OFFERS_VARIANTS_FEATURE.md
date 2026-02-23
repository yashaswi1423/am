# Offers Variants Feature

## Overview
Updated the Offers section in the admin dashboard to support variants (size, color, stock) just like the Inventory section. This makes it easier for customers to select specific variants when ordering offer items.

## Changes Made

### 1. Frontend - Offers Page
**File:** `am/admin-dashboard/client/src/pages/Offers.jsx`

Added variant management features:
- **Variant State Management**: Added `variants` state array and `showVariants` toggle
- **Variant Functions**:
  - `handleAddVariant()` - Add single variant manually
  - `handleRemoveVariant()` - Remove a variant
  - `handleVariantChange()` - Update variant properties
  - `handleGenerateVariants()` - Auto-generate all size/color combinations
- **Variant UI Section**: Added collapsible variants section in the modal with:
  - Size dropdown (XS, S, M, L, XL, XXL)
  - Color dropdown (Black, White, Grey, Blue, Red, Green, Yellow, Pink, Brown, Navy)
  - Stock quantity input
  - Price adjustment input (±)
  - Available checkbox
  - Delete button
  - Summary showing total variants and total stock

### 2. Backend - Offers Controller
**File:** `am/admin-dashboard/server/controllers/offersController.js`

Updated API endpoints to handle variants:

**createOffer():**
- Accepts `variants` array in request body
- Inserts variants into `offer_variants` table after creating offer
- Each variant includes: size, color, sku, stock_quantity, price_adjustment, is_available

**updateOffer():**
- Accepts `variants` array in request body
- Deletes existing variants for the offer
- Inserts new variants from the request
- Maintains variant data integrity

**getAllOffers() & getOfferById():**
- Already had variant fetching via LEFT JOIN
- Returns variants array with each offer

### 3. Database Schema
**Table:** `offer_variants` (already exists in database)

Columns:
- `variant_id` - Primary key
- `offer_id` - Foreign key to offers table
- `size` - VARCHAR(20)
- `color` - VARCHAR(50)
- `sku` - VARCHAR(100) UNIQUE
- `stock_quantity` - INT
- `price_adjustment` - DECIMAL(10, 2)
- `is_available` - BOOLEAN
- `created_at`, `updated_at` - Timestamps

## How It Works

### For Admin:

1. **Create New Offer with Variants:**
   - Go to Admin Dashboard → Offers
   - Click "Add Offer"
   - Fill in offer details (name, prices, etc.)
   - Click "Show Variants"
   - Option 1: Click "Generate All" to create all size/color combinations (60 variants)
   - Option 2: Click "+ Add Variant" to add specific variants manually
   - Set stock quantity for each variant
   - Optionally set price adjustment (e.g., +50 for XL sizes)
   - Click "Create Offer"

2. **Edit Existing Offer:**
   - Click Edit button on any offer
   - Variants section shows existing variants
   - Add, remove, or modify variants as needed
   - Click "Update Offer"

3. **Variant Management:**
   - Each variant has independent stock tracking
   - Price adjustment allows variant-specific pricing
   - Available checkbox to enable/disable specific variants
   - SKU auto-generated for each variant

### For Customers:
(Customer-facing website will need to be updated to show variant selection)

When viewing an offer product:
- Select size from available sizes
- Select color from available colors
- Only combinations with stock > 0 will be available
- Price shows base offer price + variant price adjustment
- Add to cart with selected variant

## Example Scenarios

### Scenario 1: Winter Special Combo
- Base offer: ₹1600 → ₹999 (38% OFF)
- Variants:
  - M, Black: 10 units, ₹0 adjustment
  - L, Black: 15 units, ₹0 adjustment
  - XL, Black: 8 units, ₹50 adjustment (₹1049)
  - M, Blue: 12 units, ₹0 adjustment
  - L, Blue: 10 units, ₹0 adjustment

### Scenario 2: Generate All Variants
- Click "Generate All"
- Creates 60 variants (6 sizes × 10 colors)
- Each starts with 10 units stock
- All set to available
- Admin can then adjust stock/availability as needed

## API Endpoints

### Create Offer with Variants
```
POST /api/offers
Body: {
  name: "Winter Special",
  original_price: 1600,
  offer_price: 999,
  variants: [
    {
      size: "M",
      color: "Black",
      sku: "OFFER-123-M-Black",
      stock_quantity: 10,
      price_adjustment: 0,
      is_available: true
    },
    ...
  ]
}
```

### Update Offer with Variants
```
PUT /api/offers/:id
Body: {
  name: "Winter Special",
  original_price: 1600,
  offer_price: 999,
  variants: [...]
}
```

### Get Offers (includes variants)
```
GET /api/offers
Response: {
  success: true,
  data: [
    {
      offer_id: 1,
      offer_name: "Winter Special",
      variants: [
        {
          variant_id: 1,
          size: "M",
          color: "Black",
          stock_quantity: 10,
          ...
        }
      ]
    }
  ]
}
```

## Testing Steps

1. **Setup:**
   - Database already has `offer_variants` table
   - Deploy admin dashboard changes
   - No SQL changes needed

2. **Admin Testing:**
   - Login to admin dashboard
   - Go to Offers page
   - Click "Add Offer"
   - Fill in offer details
   - Click "Show Variants"
   - Click "Generate All" - verify 60 variants created
   - Modify some variant stock quantities
   - Click "Create Offer"
   - Verify offer appears in list
   - Click Edit on the offer
   - Verify variants load correctly
   - Modify variants and save
   - Verify changes persist

3. **API Testing:**
   - Create offer with variants via API
   - Verify variants saved in database
   - Update offer variants via API
   - Verify old variants deleted and new ones inserted
   - Get offer by ID and verify variants included

## Benefits

1. **Better Inventory Management**: Track stock for each size/color combination
2. **Flexible Pricing**: Set different prices for different sizes (e.g., XL costs more)
3. **Customer Experience**: Customers can select exact variant they want
4. **Consistency**: Same variant system as regular products in Inventory
5. **Scalability**: Easy to add new sizes or colors

## Notes

- Variants are optional - offers can still be created without variants
- Stock quantity at offer level is separate from variant stock
- Price adjustment is added to the base offer price
- SKU must be unique across all offer variants
- Deleting an offer cascades to delete all its variants
- "Generate All" creates 60 variants (6 sizes × 10 colors) with 10 units each

## Future Enhancements (Optional)

- Bulk edit variant stock quantities
- Import/export variants via CSV
- Variant images (different image per color)
- Low stock alerts for variants
- Variant-specific discounts
- Customer-facing variant selector on website
