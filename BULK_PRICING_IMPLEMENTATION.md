# Bulk Pricing Implementation Guide

## Overview
This document outlines the implementation of bulk pricing feature for the e-commerce platform, allowing products to have quantity-based pricing (e.g., "3 for ₹1000", "5 for ₹1500").

## Database Changes

### 1. Run the SQL Script
Execute `am/admin-dashboard/database/add_bulk_pricing.sql` in your Supabase SQL Editor.

This creates:
- `bulk_pricing` table with columns:
  - `bulk_pricing_id` (Primary Key)
  - `product_id` (Foreign Key to products)
  - `min_quantity` (Minimum quantity for this price tier)
  - `price_per_unit` (Price per unit at this tier)
  - `display_text` (Display text like "3 for ₹1000")
  - `is_active` (Boolean)
  - Timestamps

## Backend Changes Needed

### 1. Update Products Controller (`am/admin-dashboard/server/controllers/productsController.js`)

Add bulk pricing to product queries:

```javascript
// In getAllProducts and getProductById, add this to the SELECT:
COALESCE(
  json_agg(jsonb_build_object(
    'bulk_pricing_id', bp.bulk_pricing_id,
    'min_quantity', bp.min_quantity,
    'price_per_unit', bp.price_per_unit,
    'display_text', bp.display_text,
    'is_active', bp.is_active
  ) ORDER BY bp.min_quantity) FILTER (WHERE bp.bulk_pricing_id IS NOT NULL),
  '[]'
) as bulk_pricing

// Add LEFT JOIN:
LEFT JOIN bulk_pricing bp ON p.product_id = bp.product_id AND bp.is_active = true
```

### 2. Create Bulk Pricing Routes (`am/admin-dashboard/server/routes/bulkPricing.js`)

```javascript
import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add bulk pricing to product
router.post('/:productId/bulk-pricing', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { min_quantity, total_price } = req.body;
    
    const price_per_unit = total_price / min_quantity;
    const display_text = `${min_quantity} for ₹${total_price}`;
    
    const result = await db.insert(
      `INSERT INTO bulk_pricing (product_id, min_quantity, price_per_unit, display_text)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [productId, min_quantity, price_per_unit, display_text]
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete bulk pricing
router.delete('/bulk-pricing/:id', authenticateToken, async (req, res) => {
  try {
    await db.deleteRecord('DELETE FROM bulk_pricing WHERE bulk_pricing_id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
```

### 3. Register Routes in `server/index.js`

```javascript
import bulkPricingRoutes from './routes/bulkPricing.js';
app.use('/api/products', bulkPricingRoutes);
```

## Frontend Changes

### 1. Admin Dashboard - Inventory Page ✅ DONE
- Added bulk pricing state management
- Added UI for adding/editing/removing bulk pricing tiers
- Shows calculated price per unit

### 2. Customer Website - ProductModal ✅ DONE
- Fixed description display (now shows actual product description)
- Variants already working correctly

### 3. Customer Website - Add Bulk Pricing Display

Update `am/src/components/ProductModal.jsx` to show bulk pricing options:

```javascript
// Add after price display:
{product.bulk_pricing && product.bulk_pricing.length > 0 && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
    <p className="text-xs font-semibold text-green-800 mb-2">Bulk Discounts Available:</p>
    <div className="space-y-1">
      {product.bulk_pricing.map((bulk, idx) => (
        <div key={idx} className="text-xs text-green-700">
          • {bulk.display_text} (₹{bulk.price_per_unit.toFixed(2)}/piece)
        </div>
      ))}
    </div>
  </div>
)}
```

## Testing

1. **Admin Dashboard**:
   - Create a product
   - Add bulk pricing: "3 for ₹1000"
   - Add another: "5 for ₹1500"
   - Verify they save correctly

2. **Customer Website**:
   - View product details
   - Verify description shows correctly
   - Verify variants (colors/sizes) work
   - Verify bulk pricing displays

## Deployment Steps

1. Run SQL script in Supabase
2. Deploy backend changes to Vercel
3. Deploy frontend changes to Vercel
4. Test all functionality

## Status

- ✅ Database schema created
- ✅ Admin UI for bulk pricing added
- ✅ Product description fixed
- ⏳ Backend API endpoints (need to implement)
- ⏳ Customer website bulk pricing display (need to implement)
