# Bulk Order Minimum Amount Feature

## Overview
This feature allows the admin to set a minimum order amount for bulk orders (products with price = ₹0). When customers add bulk order products to their cart and proceed to checkout, they will see the configured minimum amount instead of ₹0.

## Changes Made

### 1. Database Changes
**File:** `am/admin-dashboard/database/add_minimum_bulk_order_amount.sql`

Added a new system setting:
- `minimum_bulk_order_amount` - Default value: ₹1000
- This setting stores the minimum amount to charge for bulk orders

**To Apply:**
Run this SQL in your Supabase SQL Editor:
```sql
INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES
('minimum_bulk_order_amount', '1000', 'Minimum amount to charge for bulk orders (products with price = 0)', 'admin')
ON CONFLICT (setting_key) 
DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;
```

### 2. Admin Dashboard - Settings Page
**File:** `am/admin-dashboard/client/src/pages/Settings.jsx`

Added new section to configure minimum bulk order amount:
- Input field to set the amount (₹)
- Save button to update the setting
- Fetches current value on page load
- Updates the system_settings table when saved

### 3. Customer Website - Cart Page
**File:** `am/src/pages/Cart.jsx`

Updated cart logic:
- Fetches minimum bulk order amount from backend on component mount
- Detects if cart contains any bulk order items (price = ₹0)
- If bulk items exist, uses minimum bulk order amount as total
- Shows "Bulk Order" label instead of ₹0 for bulk items
- Displays bulk order notice in order summary with the minimum amount

## How It Works

### For Admin:
1. Go to Admin Dashboard → Settings
2. Find "Minimum Bulk Order Amount" section
3. Enter the desired amount (e.g., 1000)
4. Click "Save Amount"
5. The amount is now configured system-wide

### For Customers:
1. Browse products and add bulk order items (price = ₹0) to cart
2. Go to cart page
3. See "Bulk Order" label instead of ₹0 for bulk items
4. In order summary, see:
   - "📦 Bulk Order" notice
   - "Minimum order amount: ₹1000" (or configured amount)
   - Total shows the minimum bulk order amount
5. Proceed to payment with the minimum amount

## Example Scenarios

### Scenario 1: Only Bulk Items in Cart
- Customer adds 3 bulk order t-shirts (price = ₹0 each)
- Cart shows: "Bulk Order" for each item
- Total at checkout: ₹1000 (minimum bulk order amount)

### Scenario 2: Mixed Cart (Bulk + Regular Items)
- Customer adds 2 bulk order items (₹0) + 1 regular item (₹500)
- Cart shows: "Bulk Order" for bulk items, ₹500 for regular item
- Total at checkout: ₹1000 (minimum bulk order amount applies)

### Scenario 3: Only Regular Items
- Customer adds regular items (₹300 + ₹400)
- Cart shows: ₹300 and ₹400
- Total at checkout: ₹700 (normal calculation)

## API Endpoints Used

### Get Minimum Bulk Order Amount
```
GET /api/system/settings/minimum_bulk_order_amount
```

### Update Minimum Bulk Order Amount
```
PUT /api/system/settings/minimum_bulk_order_amount
Body: { value: "1000", updated_by: "admin" }
Headers: { Authorization: "Bearer <token>" }
```

## Testing Steps

1. **Setup:**
   - Run the SQL script in Supabase
   - Deploy admin dashboard changes
   - Deploy customer website changes

2. **Admin Testing:**
   - Login to admin dashboard
   - Go to Settings page
   - Verify minimum bulk order amount field shows current value
   - Change the amount to 1500
   - Click Save
   - Refresh page and verify new value is loaded

3. **Customer Testing:**
   - Create a product with price = ₹0 (bulk order product)
   - Add it to cart on customer website
   - Go to cart page
   - Verify "Bulk Order" label shows instead of ₹0
   - Verify order summary shows bulk order notice
   - Verify total shows ₹1500 (or configured amount)
   - Proceed to payment and verify amount is correct

## Notes

- The minimum bulk order amount applies to the entire order if ANY bulk item is in the cart
- This is intentional - bulk orders have a minimum order value regardless of quantity
- Admin can change this amount anytime from Settings page
- Changes take effect immediately for new orders
- Default value is ₹1000 if not configured

## Future Enhancements (Optional)

- Allow different minimum amounts for different product categories
- Show bulk pricing tiers (e.g., 3 items = ₹1000, 5 items = ₹1500)
- Add bulk order discount calculator
- Email notifications when bulk orders are placed
