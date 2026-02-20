# Categories Management & Maintenance Mode Setup Guide

## Overview
Two new powerful features have been added:
1. **Categories Management** - Admin can create, edit, and delete product categories
2. **Maintenance Mode** - Toggle to show maintenance page on customer website

## Database Setup

### Run the SQL Migration in Supabase

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **"New query"**
4. Open the file: `am/admin-dashboard/database/categories_and_maintenance.sql`
5. Copy ALL the content
6. Paste into Supabase SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)
8. Wait for "Success" message

This creates:
- `categories` table - Stores all product categories
- `system_settings` table - Stores maintenance mode and other settings
- Inserts 15 default categories (your existing ones)
- Sets maintenance mode to OFF by default

## Features

### 1. Categories Management

#### Admin Dashboard Access:
1. Login to admin dashboard
2. Click **"Categories"** in the sidebar (folder icon)
3. You'll see all categories with:
   - Category ID
   - Category Name
   - Display Order (lower numbers appear first)
   - Status (Active/Inactive toggle)
   - Edit and Delete actions

#### Create New Category:
1. Click **"Add Category"** button
2. Fill in:
   - **Category Name** (required) - e.g., "Winter Wear"
   - **Display Order** - Number for sorting (0 = first)
   - **Active** - Toggle to show/hide on website
3. Click **"Create Category"**

#### Edit Category:
1. Click the **Edit** icon (pencil) next to any category
2. Modify the details
3. Click **"Update Category"**

#### Delete Category:
1. Click the **Delete** icon (trash) next to any category
2. Confirm deletion
3. **Note**: Cannot delete if products/offers are using this category

#### Toggle Status:
- Click the **Active/Inactive** badge to quickly enable/disable a category
- Inactive categories won't show on the customer website

#### Customer Website Integration:
- Categories automatically appear in the "Explore Our Collection" section
- Only active categories are shown
- Sorted by display_order, then alphabetically
- Clicking a category filters products

### 2. Maintenance Mode

#### Admin Dashboard Access:
1. Login to admin dashboard
2. Click **"Settings"** in the sidebar (gear icon)
3. You'll see the "Maintenance Mode" section

#### Enable Maintenance Mode:
1. In Settings page, find "Enable Maintenance Mode"
2. Click the **toggle switch** to turn it ON (red)
3. The customer website will immediately show the maintenance page
4. A warning message appears confirming maintenance mode is active

#### Customize Maintenance Message:
1. In the "Maintenance Message" text area, type your custom message
2. Click **"Save Message"**
3. This message will be displayed to customers during maintenance

#### Disable Maintenance Mode:
1. Click the toggle switch to turn it OFF (gray)
2. The customer website will immediately become accessible again

#### Customer Website Behavior:
- When maintenance mode is ON:
  - Shows a beautiful maintenance page with your custom message
  - Displays animated icons and loading indicators
  - Shows "We'll Be Right Back!" message
  - Customers cannot access any other pages
- When maintenance mode is OFF:
  - Website functions normally
  - All pages are accessible

#### Auto-Check Feature:
- Customer website checks maintenance status every 30 seconds
- If admin enables maintenance mode, customers see it within 30 seconds
- No page refresh needed

## API Endpoints

### Categories:
```
GET    /api/categories              - Get all categories
GET    /api/categories/:id          - Get single category
POST   /api/categories              - Create category (admin)
PUT    /api/categories/:id          - Update category (admin)
DELETE /api/categories/:id          - Delete category (admin)
PATCH  /api/categories/:id/toggle   - Toggle active status (admin)
```

### System Settings:
```
GET    /api/system/maintenance/status     - Get maintenance status (public)
POST   /api/system/maintenance/toggle     - Toggle maintenance mode (admin)
GET    /api/system/settings               - Get all settings (admin)
PUT    /api/system/settings/:key          - Update setting (admin)
```

## Use Cases

### Categories Management:

**Scenario 1: Adding Seasonal Category**
1. Admin wants to add "Winter Collection" category
2. Goes to Categories page
3. Clicks "Add Category"
4. Enters "Winter Collection", display order "1" (to show first)
5. Clicks "Create Category"
6. Category immediately appears on customer website

**Scenario 2: Hiding Category Temporarily**
1. Admin wants to hide "Summer Wear" during winter
2. Goes to Categories page
3. Clicks the "Active" badge next to "Summer Wear"
4. Status changes to "Inactive"
5. Category disappears from customer website
6. Products remain in database, just not visible

**Scenario 3: Reordering Categories**
1. Admin wants "Hoodies" to appear before "T-Shirts"
2. Edits "Hoodies" category
3. Changes display order to "0"
4. Edits "T-Shirts" category
5. Changes display order to "1"
6. Categories reorder on customer website

### Maintenance Mode:

**Scenario 1: Updating Inventory**
1. Admin needs to update stock for 2 hours
2. Goes to Settings page
3. Updates maintenance message: "We're updating our inventory with new arrivals! Back in 2 hours."
4. Toggles maintenance mode ON
5. Customers see maintenance page
6. Admin updates inventory in peace
7. Toggles maintenance mode OFF when done
8. Website is live again

**Scenario 2: Emergency Maintenance**
1. Website has an issue
2. Admin quickly enables maintenance mode
3. Customers see maintenance page instead of errors
4. Admin fixes the issue
5. Disables maintenance mode
6. Website is back online

**Scenario 3: Scheduled Maintenance**
1. Admin plans maintenance for Sunday 2 AM
2. Sets custom message: "Scheduled maintenance in progress. We'll be back by 4 AM!"
3. Enables maintenance mode at 2 AM
4. Performs updates
5. Disables at 4 AM
6. Customers can access website again

## Testing

### Test Categories:
1. **Create**: Add a test category "Test Category"
2. **Verify**: Check it appears on customer website
3. **Edit**: Change name to "Updated Category"
4. **Toggle**: Disable it, verify it disappears from website
5. **Delete**: Remove the test category

### Test Maintenance Mode:
1. **Enable**: Turn on maintenance mode in admin settings
2. **Verify**: Open customer website in incognito/private window
3. **Check**: Should see maintenance page, not regular website
4. **Message**: Verify your custom message appears
5. **Disable**: Turn off maintenance mode
6. **Verify**: Customer website should be accessible again

## Important Notes

### Categories:
- Cannot delete categories that are in use by products or offers
- Inactive categories are hidden but not deleted
- Display order determines the sequence on website
- Category names must be unique
- Changes reflect immediately on customer website

### Maintenance Mode:
- Admin dashboard is always accessible (not affected by maintenance mode)
- Only customer-facing website shows maintenance page
- Status is checked every 30 seconds automatically
- Changes take effect immediately
- Custom message supports plain text (no HTML)

## Troubleshooting

### Categories Not Showing:
1. Check if category is marked as "Active"
2. Verify API endpoint: `/api/categories?is_active=true`
3. Check browser console for errors
4. Refresh the page

### Maintenance Mode Not Working:
1. Check API endpoint: `/api/system/maintenance/status`
2. Verify response shows correct status
3. Clear browser cache
4. Check if customer website is checking status (every 30 seconds)

### Cannot Delete Category:
- Error message will tell you how many products/offers are using it
- First reassign those products to another category
- Then delete the category

## Benefits

### Categories Management:
✅ Full control over product organization
✅ Easy to add seasonal categories
✅ Can hide categories without deleting
✅ Flexible ordering system
✅ Prevents accidental deletion of used categories

### Maintenance Mode:
✅ Professional maintenance page
✅ Instant activation/deactivation
✅ Custom messages for customers
✅ Admin can work without customer interference
✅ Automatic status checking
✅ Beautiful UI with animations

## Next Steps

1. Run the SQL migration in Supabase
2. Deploy the updated code (already pushed to GitHub)
3. Wait for Vercel to deploy (2-3 minutes)
4. Test categories management in admin dashboard
5. Test maintenance mode toggle
6. Verify customer website shows maintenance page when enabled

Your categories and maintenance mode features are now ready to use!
