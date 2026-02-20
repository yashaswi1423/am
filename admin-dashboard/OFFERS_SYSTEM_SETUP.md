# Offers System Setup Guide

## Overview
The Offers System allows you to manage special deals and discounted products with original price strikethrough, highlighted offer price, stock management, and Add to Cart/Buy Now functionality.

## Database Setup

### 1. Run the SQL Migration
Execute the following SQL file to create the offers tables:
```bash
psql -U your_username -d your_database -f am/admin-dashboard/database/offers_system.sql
```

Or manually run the SQL in your PostgreSQL database:
- File: `am/admin-dashboard/database/offers_system.sql`

This creates:
- `offers` table - Main offers data with original/offer prices
- `offer_images` table - Multiple images per offer
- `offer_variants` table - Size/color variants with stock

## Backend Setup

### 2. Routes are Already Configured
The offers API endpoints are automatically available at:
- `GET /api/offers` - Get all offers
- `GET /api/offers/:id` - Get single offer
- `POST /api/offers` - Create new offer (admin only)
- `PUT /api/offers/:id` - Update offer (admin only)
- `DELETE /api/offers/:id` - Delete offer (admin only)
- `POST /api/offers/:id/images` - Add image
- `PATCH /api/offers/:id/stock` - Update stock

## Admin Dashboard

### 3. Access Offers Management
1. Login to admin dashboard
2. Click "Offers" in the sidebar
3. You'll see the Offers Management page

### 4. Create a New Offer
Click "Add Offer" button and fill in:
- **Offer Name** (required) - e.g., "Winter Special Combo"
- **Description** - Details about the offer
- **Original Price** (required) - The regular price (will be striked through)
- **Offer Price** (required) - The discounted price (highlighted)
- **Stock Quantity** - Available inventory
- **Category** - Default: "Special Offers"
- **Valid Until** - Optional expiry date
- **Active** - Toggle to show/hide on website
- **Featured** - Mark as featured offer

The system automatically calculates:
- Discount percentage
- Savings amount

### 5. Manage Existing Offers
- **Edit** - Click edit icon to modify offer details
- **Delete** - Click delete icon to remove offer
- **View** - See all offers in a table with:
  - ID, Name, Image
  - Original Price (strikethrough)
  - Offer Price (highlighted)
  - Discount percentage badge
  - Stock quantity
  - Active/Inactive status

## Customer-Facing Website

### 6. Offers Display
The offers section on the homepage now:
- Fetches offers from the database (not hardcoded)
- Shows original price with strikethrough
- Highlights offer price in large text
- Displays discount percentage badge
- Includes Add to Cart and Buy Now buttons
- Auto-scrolls on desktop (marquee effect)
- Swipeable on mobile devices
- Shows loading state while fetching
- Handles empty state gracefully

## Features

### Price Display
- **Original Price**: Shown with strikethrough in red
- **Offer Price**: Large, bold, highlighted price
- **Discount Badge**: Shows percentage off (e.g., "38% OFF")

### Stock Management
- Track inventory for each offer
- Update stock quantities from admin panel
- Prevent overselling

### Image Management
- Upload multiple images per offer
- Set primary image
- Display order control
- Stored in Supabase Storage

### Variants (Optional)
- Add size/color variants
- Individual stock per variant
- Price adjustments per variant

## API Examples

### Get All Active Offers
```javascript
GET /api/offers?is_active=true

Response:
{
  "success": true,
  "data": [
    {
      "offer_id": 1,
      "offer_name": "Winter Special Combo",
      "original_price": 1600.00,
      "offer_price": 999.00,
      "discount_percentage": 37.56,
      "stock_quantity": 50,
      "is_active": true,
      "images": [...],
      "variants": [...]
    }
  ]
}
```

### Create New Offer
```javascript
POST /api/offers
Authorization: Bearer <admin_token>

Body:
{
  "name": "Summer Sale Bundle",
  "description": "Best summer collection",
  "original_price": 1800,
  "offer_price": 1199,
  "stock_quantity": 30,
  "is_active": true,
  "is_featured": true
}
```

## Testing

### 1. Test Backend
```bash
# Get all offers
curl http://localhost:5000/api/offers

# Get active offers only
curl http://localhost:5000/api/offers?is_active=true
```

### 2. Test Admin Dashboard
1. Navigate to `/offers` in admin dashboard
2. Create a test offer
3. Verify it appears in the list
4. Edit and delete to test CRUD operations

### 3. Test Customer Website
1. Visit homepage
2. Scroll to "Special Offers" section
3. Verify offers display with:
   - Strikethrough original price
   - Highlighted offer price
   - Discount badge
   - Working Add to Cart/Buy Now buttons

## Troubleshooting

### Offers Not Showing
- Check database connection
- Verify offers table exists
- Ensure offers have `is_active = true`
- Check API endpoint: `/api/offers`

### Images Not Loading
- Verify Supabase Storage is configured
- Check image URLs in database
- Ensure CORS is enabled for images

### Admin Can't Create Offers
- Verify authentication token
- Check admin permissions
- Review server logs for errors

## Sample Data

The SQL file includes 3 sample offers:
1. Winter Special Combo - ₹1600 → ₹999
2. Summer Sale Bundle - ₹1800 → ₹1199
3. Festive Offer Pack - ₹2000 → ₹1299

You can modify or delete these after testing.

## Next Steps

1. Run the database migration
2. Create your first offer in admin dashboard
3. Add images to the offer
4. Test on customer-facing website
5. Monitor stock levels
6. Update offers as needed

## Support

For issues or questions:
- Check server logs: `am/admin-dashboard/server/`
- Review database queries
- Test API endpoints directly
- Verify environment variables
