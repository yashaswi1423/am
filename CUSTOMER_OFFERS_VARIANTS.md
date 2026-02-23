# Customer Website - Offers with Variants

## Overview
Updated the customer-facing website to display offer variants (size, color) just like regular products. Customers can now click on offers to view details and select their preferred size and color before adding to cart.

## Changes Made

### 1. Home Page (Customer Website)
**File:** `am/src/pages/Home.jsx`

**Added State:**
- `selectedOffer` - Tracks which offer is currently being viewed in modal

**Updated Functions:**
- `handleOfferClick(offer)` - Opens offer in ProductModal with variant selection
  - Transforms offer data to product format
  - Includes variants array
  - Marks as offer with `isOffer: true` flag
  - Passes discount percentage
- `handleOfferAddToCart(offerProduct)` - Adds offer with selected variant to cart
- `handleOfferBuyNow(offerProduct)` - Adds offer to cart and navigates to checkout

**UI Changes:**
- Made offer cards clickable (both desktop and mobile)
- Removed inline "Add to Cart" and "Buy Now" buttons from offer cards
- Added "Click/Tap to view details & select size/color" message
- Added separate modal for offers using ProductModal component

### 2. Product Modal
**File:** `am/src/components/ProductModal.jsx`

**Added Offer Support:**
- Detects if product is an offer via `isOffer` flag
- Shows original price (strikethrough) for offers
- Displays discount badge (e.g., "38% OFF")
- Handles offer pricing with variant adjustments
- Works seamlessly with existing variant selection logic

**Display Logic:**
- If offer: Shows original price → offer price with discount badge
- If regular product: Shows only the price
- Variant price adjustments apply to both

## How It Works

### For Customers:

1. **Browse Offers:**
   - Scroll through offers section (auto-scrolling on desktop, swipe on mobile)
   - See offer name, original price (strikethrough), offer price, discount percentage

2. **View Offer Details:**
   - Click/tap on any offer card
   - Modal opens showing:
     - Multiple images (if available)
     - Offer name and description
     - Original price (strikethrough) with discount badge
     - Offer price
     - Size selection (if variants exist)
     - Color selection (if variants exist)
     - Stock availability per variant
     - Reviews section

3. **Select Variant:**
   - Choose size from available sizes (XS, S, M, L, XL, XXL)
   - Choose color from available colors
   - See stock quantity for selected variant
   - Price updates if variant has price adjustment

4. **Add to Cart:**
   - Click "Add to Cart" - adds offer with selected variant
   - Click "Buy Now" - adds to cart and goes to checkout
   - Cart shows offer with selected size and color

## Example User Flow

### Scenario: Winter Special Combo Offer

1. Customer sees offer card:
   - "Winter Special Combo"
   - ~~₹1600~~ → ₹999
   - "38% OFF"

2. Customer clicks on offer card

3. Modal opens showing:
   - Product images
   - ~~₹1600~~ ₹999 (38% OFF badge)
   - Size options: M, L, XL
   - Color options: Black, Blue, Grey
   - Stock: "10 in stock" for selected variant

4. Customer selects:
   - Size: L
   - Color: Black

5. Customer clicks "Add to Cart"

6. Cart shows:
   - "Winter Special Combo"
   - Size: L, Color: Black
   - Price: ₹999

## Technical Details

### Offer Data Structure
```javascript
{
  id: 1,
  name: "Winter Special Combo",
  description: "Premium winter collection",
  originalPrice: 1600,
  offerPrice: 999,
  discount: 38,
  image: "/image.jpg",
  images: ["/image1.jpg", "/image2.jpg"],
  variants: [
    {
      variant_id: 1,
      size: "M",
      color: "Black",
      stock_quantity: 10,
      price_adjustment: 0,
      is_available: true
    },
    {
      variant_id: 2,
      size: "L",
      color: "Black",
      stock_quantity: 15,
      price_adjustment: 0,
      is_available: true
    }
  ]
}
```

### ProductModal Props for Offers
```javascript
<ProductModal
  product={{
    id: "offer-1",
    name: "Winter Special Combo",
    price: 999,
    originalPrice: 1600,
    discount: 38,
    isOffer: true,
    variants: [...],
    images: [...]
  }}
  onClose={() => setSelectedOffer(null)}
  onAddToCart={handleOfferAddToCart}
  onBuyNow={handleOfferBuyNow}
/>
```

## Benefits

1. **Consistent Experience**: Offers work exactly like regular products
2. **Variant Selection**: Customers can choose specific size/color
3. **Stock Visibility**: Shows available stock per variant
4. **Better UX**: Modal provides detailed view with all information
5. **Mobile Friendly**: Touch-optimized for mobile devices
6. **Price Transparency**: Shows original price, offer price, and discount

## Comparison: Before vs After

### Before:
- Offers had hardcoded size/color ('M', 'Default')
- No variant selection
- Inline buttons on offer cards
- No detailed view

### After:
- Offers support full variant system
- Size and color selection in modal
- Stock tracking per variant
- Detailed modal view with images
- Discount badge and original price display
- Consistent with regular products

## Testing Steps

1. **View Offers:**
   - Go to customer website homepage
   - Scroll to "Special Offers" section
   - Verify offers display with prices and discount

2. **Click Offer:**
   - Click on any offer card
   - Verify modal opens
   - Verify original price shows (strikethrough)
   - Verify discount badge shows
   - Verify offer price displays

3. **Select Variants:**
   - If offer has variants, verify size dropdown shows
   - Select different sizes
   - Verify color dropdown shows
   - Select different colors
   - Verify stock quantity updates
   - Verify only available variants are selectable

4. **Add to Cart:**
   - Select size and color
   - Click "Add to Cart"
   - Go to cart page
   - Verify offer shows with selected variant
   - Verify price is correct

5. **Buy Now:**
   - Open offer modal
   - Select variant
   - Click "Buy Now"
   - Verify redirects to cart
   - Verify scrolls to payment section

## Notes

- Offers without variants will still work (no size/color selection shown)
- Price adjustments per variant work for offers too
- Stock quantity is tracked per variant
- Multiple images supported for offers
- Auto-scrolling continues on desktop
- Touch-scrolling works on mobile
- Modal is responsive for all screen sizes

## Future Enhancements (Optional)

- Offer countdown timer (valid until date)
- "Limited Stock" badge for low stock variants
- Offer-specific reviews
- Wishlist for offers
- Share offer functionality
- Offer comparison feature
