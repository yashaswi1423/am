# 🏪 Inventory Management System - Implementation Guide

## 🎯 Overview

This guide explains how to implement a complete inventory management system where:
- ✅ Admin can add products with images, prices, colors, sizes, stock
- ✅ Products are stored in database (not hardcoded)
- ✅ Main website fetches products from database
- ✅ Orders show product images and details
- ✅ Stock is automatically updated when orders are placed

---

## 📊 Database Schema

### 1. Products Table (Enhanced)

```sql
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Product Images Table

```sql
CREATE TABLE product_images (
  image_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Product Variants Table (Colors & Sizes)

```sql
CREATE TABLE product_variants (
  variant_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  color VARCHAR(50),
  size VARCHAR(20),
  sku VARCHAR(100) UNIQUE,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Update Order Items Table

```sql
ALTER TABLE order_items 
ADD COLUMN variant_id INTEGER REFERENCES product_variants(variant_id),
ADD COLUMN product_image_url TEXT;
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Inventory Page                                     │    │
│  │  - Add Product Form                                 │    │
│  │  - Upload Images (Supabase Storage)                 │    │
│  │  - Add Variants (Colors, Sizes, Stock)             │    │
│  │  - Edit/Delete Products                             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Backend API
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE DATABASE                           │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐      │
│  │ products │  │ product_     │  │ product_        │      │
│  │          │→ │ images       │  │ variants        │      │
│  └──────────┘  └──────────────┘  └─────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   MAIN WEBSITE                               │
│  - Fetches products from database                           │
│  - Shows product images, prices, variants                   │
│  - Customers can order with specific color/size            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Steps

### Phase 1: Database Setup (30 minutes)

1. **Run SQL in Supabase:**
   - Create products table
   - Create product_images table
   - Create product_variants table
   - Update order_items table

2. **Set up Supabase Storage:**
   - Create `product-images` bucket
   - Set public access policies

### Phase 2: Backend API (2 hours)

Create these API endpoints:

```
POST   /api/products              - Create new product
GET    /api/products              - Get all products
GET    /api/products/:id          - Get single product
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product

POST   /api/products/:id/images   - Upload product images
DELETE /api/products/images/:id   - Delete image

POST   /api/products/:id/variants - Add variant
PUT    /api/products/variants/:id - Update variant
DELETE /api/products/variants/:id - Delete variant
```

### Phase 3: Admin Dashboard UI (3 hours)

Create `Inventory.jsx` page with:
- Product list table
- Add/Edit product form
- Image upload component
- Variant management
- Stock tracking

### Phase 4: Frontend Integration (1 hour)

Update main website:
- Fetch products from API instead of hardcoded data
- Display product variants
- Handle stock availability

### Phase 5: Order Integration (1 hour)

Update orders:
- Save variant_id and product_image_url
- Display product images in order details
- Update stock when order is placed

---

## 📝 Detailed Implementation

### Step 1: Database Schema SQL

**File:** `am/admin-dashboard/database/inventory_system.sql`

```sql
-- ============================================
-- INVENTORY MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  image_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  variant_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  color VARCHAR(50),
  size VARCHAR(20),
  sku VARCHAR(100) UNIQUE,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Update Order Items Table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS variant_id INTEGER REFERENCES product_variants(variant_id),
ADD COLUMN IF NOT EXISTS product_image_url TEXT;

-- 5. Create Indexes for Performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- 6. Create Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Sample Data (Optional)
INSERT INTO products (name, description, category, base_price) VALUES
('Classic White Tee', 'Premium cotton t-shirt', 'T-Shirts', 299.00),
('Black Essential Tee', 'Comfortable everyday tee', 'T-Shirts', 299.00);

-- Add variants for first product
INSERT INTO product_variants (product_id, color, size, sku, stock_quantity) VALUES
(1, 'White', 'S', 'CWT-W-S', 50),
(1, 'White', 'M', 'CWT-W-M', 100),
(1, 'White', 'L', 'CWT-W-L', 75),
(1, 'White', 'XL', 'CWT-W-XL', 50);
```

---

### Step 2: Backend Controller

**File:** `am/admin-dashboard/server/controllers/productsController.js`

```javascript
import db from '../config/database.js';
import { uploadToSupabase, deleteFromSupabase } from '../services/supabaseStorage.js';

// Get all products with images and variants
export const getAllProducts = async (req, res) => {
  try {
    const { category, is_active } = req.query;
    
    let query = `
      SELECT 
        p.*,
        json_agg(DISTINCT jsonb_build_object(
          'image_id', pi.image_id,
          'image_url', pi.image_url,
          'display_order', pi.display_order,
          'is_primary', pi.is_primary
        )) FILTER (WHERE pi.image_id IS NOT NULL) as images,
        json_agg(DISTINCT jsonb_build_object(
          'variant_id', pv.variant_id,
          'color', pv.color,
          'size', pv.size,
          'sku', pv.sku,
          'price_adjustment', pv.price_adjustment,
          'stock_quantity', pv.stock_quantity,
          'is_available', pv.is_available
        )) FILTER (WHERE pv.variant_id IS NOT NULL) as variants
      FROM products p
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      LEFT JOIN product_variants pv ON p.product_id = pv.product_id
      WHERE 1=1
    `;
    
    const params = [];
    if (category) {
      params.push(category);
      query += ` AND p.category = $${params.length}`;
    }
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      query += ` AND p.is_active = $${params.length}`;
    }
    
    query += ` GROUP BY p.product_id ORDER BY p.created_at DESC`;
    
    const products = await db.getMany(query, params);
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, base_price, images, variants } = req.body;
    
    // Insert product
    const product = await db.insert(
      `INSERT INTO products (name, description, category, base_price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, category, base_price]
    );
    
    const productId = product.product_id;
    
    // Insert images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await db.insert(
          `INSERT INTO product_images (product_id, image_url, display_order, is_primary)
           VALUES ($1, $2, $3, $4)`,
          [productId, images[i], i, i === 0]
        );
      }
    }
    
    // Insert variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const sku = `${name.substring(0, 3).toUpperCase()}-${variant.color?.substring(0, 1)}-${variant.size}`;
        await db.insert(
          `INSERT INTO product_variants (product_id, color, size, sku, price_adjustment, stock_quantity)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [productId, variant.color, variant.size, sku, variant.price_adjustment || 0, variant.stock_quantity || 0]
        );
      }
    }
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, base_price, is_active } = req.body;
    
    await db.update(
      `UPDATE products 
       SET name = $1, description = $2, category = $3, base_price = $4, is_active = $5
       WHERE product_id = $6`,
      [name, description, category, base_price, is_active, id]
    );
    
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get all images to delete from storage
    const images = await db.getMany(
      'SELECT image_url FROM product_images WHERE product_id = $1',
      [id]
    );
    
    // Delete images from Supabase Storage
    for (const img of images) {
      await deleteFromSupabase(img.image_url);
    }
    
    // Delete product (cascade will delete images and variants)
    await db.deleteRecord('DELETE FROM products WHERE product_id = $1', [id]);
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload product image
export const uploadProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Upload to Supabase
    const imageUrl = await uploadToSupabase(file, 'product-images');
    
    // Get current image count
    const count = await db.getOne(
      'SELECT COUNT(*) as count FROM product_images WHERE product_id = $1',
      [id]
    );
    
    // Insert image record
    await db.insert(
      `INSERT INTO product_images (product_id, image_url, display_order, is_primary)
       VALUES ($1, $2, $3, $4)`,
      [id, imageUrl, count.count, count.count === 0]
    );
    
    res.json({ success: true, data: { image_url: imageUrl } });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update variant stock
export const updateVariantStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    
    await db.update(
      'UPDATE product_variants SET stock_quantity = $1 WHERE variant_id = $2',
      [stock_quantity, id]
    );
    
    res.json({ success: true, message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## 🎨 Admin Dashboard UI

This is a large feature. Would you like me to:

1. **Create the complete implementation now** (will take time to build all components)
2. **Create a simplified version first** (basic product management)
3. **Provide the complete guide** and implement it step-by-step with your approval

The full implementation includes:
- Database migrations
- Backend API (8-10 endpoints)
- Admin UI page with forms
- Image upload system
- Frontend integration
- Order system updates

**Estimated time:** 4-6 hours of development

**What would you prefer?**
