// controllers/productsController.js
import db from '../config/database.js';
import multer from 'multer';
import { uploadToSupabase, deleteFromSupabase } from '../services/supabaseStorage.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/* ===========================
   GET /api/products
=========================== */
export const getAllProducts = async (req, res) => {
  try {
    const { category, is_active } = req.query;

    let query = `
      SELECT
        p.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'image_id', pi.image_id,
            'image_url', pi.image_url,
            'display_order', pi.display_order,
            'is_primary', pi.is_primary
          ) ORDER BY jsonb_build_object(
            'image_id', pi.image_id,
            'image_url', pi.image_url,
            'display_order', pi.display_order,
            'is_primary', pi.is_primary
          )) FILTER (WHERE pi.image_id IS NOT NULL),
          '[]'
        ) as images,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'variant_id', pv.variant_id,
            'color', pv.color,
            'size', pv.size,
            'sku', pv.sku,
            'price_adjustment', pv.price_adjustment,
            'stock_quantity', pv.stock_quantity,
            'is_available', pv.is_available
          )) FILTER (WHERE pv.variant_id IS NOT NULL),
          '[]'
        ) as variants,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'bulk_pricing_id', bp.bulk_pricing_id,
            'min_quantity', bp.min_quantity,
            'price_per_unit', bp.price_per_unit,
            'display_text', bp.display_text,
            'is_active', bp.is_active
          ) ORDER BY jsonb_build_object(
            'bulk_pricing_id', bp.bulk_pricing_id,
            'min_quantity', bp.min_quantity,
            'price_per_unit', bp.price_per_unit,
            'display_text', bp.display_text,
            'is_active', bp.is_active
          )) FILTER (WHERE bp.bulk_pricing_id IS NOT NULL AND bp.is_active = true),
          '[]'
        ) as bulk_pricing
      FROM products p
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      LEFT JOIN product_variants pv ON p.product_id = pv.product_id
      LEFT JOIN bulk_pricing bp ON p.product_id = bp.product_id
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
    
    // Log image data for debugging
    console.log('=== PRODUCTS API RESPONSE ===');
    console.log(`Total products: ${products.length}`);
    products.forEach(p => {
      console.log(`Product: ${p.product_name}, Images: ${p.images?.length || 0}`);
      if (p.images && p.images.length > 0) {
        p.images.forEach((img, idx) => {
          console.log(`  Image ${idx + 1}: ${img.image_url ? img.image_url.substring(0, 80) : 'NULL'}`);
        });
      }
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ===========================
   GET /api/products/:id
=========================== */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await db.getOne(
      `SELECT 
        p.*,
        COALESCE(
          json_agg(jsonb_build_object(
            'image_id', pi.image_id,
            'image_url', pi.image_url,
            'display_order', pi.display_order,
            'is_primary', pi.is_primary
          ) ORDER BY pi.display_order) FILTER (WHERE pi.image_id IS NOT NULL),
          '[]'
        ) as images,
        COALESCE(
          json_agg(jsonb_build_object(
            'variant_id', pv.variant_id,
            'color', pv.color,
            'size', pv.size,
            'sku', pv.sku,
            'price_adjustment', pv.price_adjustment,
            'stock_quantity', pv.stock_quantity,
            'is_available', pv.is_available
          )) FILTER (WHERE pv.variant_id IS NOT NULL),
          '[]'
        ) as variants
      FROM products p
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      LEFT JOIN product_variants pv ON p.product_id = pv.product_id
      WHERE p.product_id = $1
      GROUP BY p.product_id`,
      [id]
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/products
=========================== */
export const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT REQUEST v1.0.3 ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // Extract data - SIMPLIFIED
    const { name, description, category, base_price, is_active } = req.body;
    
    // Simple validation - just check if they exist
    if (!name || !category || !base_price) {
      console.log('❌ Validation failed:', { name, category, base_price });
      return res.status(400).json({ 
        success: false, 
        message: 'Product name, category, and base price are required',
        received: { name, category, base_price }
      });
    }
    
    // Parse price
    const priceNum = parseFloat(base_price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid price value'
      });
    }
    
    console.log('✅ Validation passed, creating product...');
    
    const product = await db.insert(
      `INSERT INTO products (product_name, description, category, base_price, is_active)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description || '', category, priceNum, is_active !== false]
    );
    
    console.log('✅ Product created:', product);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PUT /api/products/:id
=========================== */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, base_price, is_active } = req.body;
    
    console.log('Updating product:', { id, name, description, category, base_price, is_active });
    
    await db.update(
      `UPDATE products 
       SET product_name = $1, description = $2, category = $3, base_price = $4, is_active = $5
       WHERE product_id = $6`,
      [name, description, category, parseFloat(base_price), is_active !== false, id]
    );
    
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /api/products/:id
=========================== */
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
      try {
        await deleteFromSupabase(img.image_url);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
    
    // Delete product (cascade will delete images and variants)
    await db.deleteRecord('DELETE FROM products WHERE product_id = $1', [id]);
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/products/:id/images
=========================== */
export const uploadProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;
    
    if (!image_url) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }
    
    // Get current image count
    const result = await db.getOne(
      'SELECT COUNT(*) as count FROM product_images WHERE product_id = $1',
      [id]
    );
    
    const count = parseInt(result.count);
    
    // Insert image record
    const image = await db.insert(
      `INSERT INTO product_images (product_id, image_url, display_order, is_primary)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, image_url, count, count === 0]
    );
    
    res.json({ success: true, data: image });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/products/:id/upload-image (File Upload)
=========================== */
export const uploadProductImageFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Upload image file - Product ID:', id);
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Upload to Supabase Storage
    const fileName = `product-${id}-${Date.now()}.${req.file.mimetype.split('/')[1]}`;
    console.log('Uploading to Supabase:', fileName);
    const uploadResult = await uploadToSupabase(req.file.buffer, fileName, req.file.mimetype, 'product-images');
    const imageUrl = uploadResult.url;
    console.log('Image uploaded successfully:', imageUrl);
    
    // Get current image count
    const countResult = await db.getOne(
      'SELECT COUNT(*) as count FROM product_images WHERE product_id = $1',
      [id]
    );
    
    const count = parseInt(countResult.count);
    console.log('Current image count:', count);
    
    // Insert image record
    const image = await db.insert(
      `INSERT INTO product_images (product_id, image_url, display_order, is_primary)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, imageUrl, count, count === 0]
    );
    
    console.log('Image record created:', image);
    res.json({ success: true, data: image, imageUrl });
  } catch (error) {
    console.error('Upload image file error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /api/products/images/:id
=========================== */
export const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get image URL
    const image = await db.getOne(
      'SELECT image_url FROM product_images WHERE image_id = $1',
      [id]
    );
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Delete from storage
    await deleteFromSupabase(image.image_url);
    
    // Delete from database
    await db.deleteRecord('DELETE FROM product_images WHERE image_id = $1', [id]);
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/products/:id/variants
=========================== */
export const createVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, size, price_adjustment, stock_quantity, is_available } = req.body;
    
    console.log('Creating variant for product:', id);
    console.log('Variant data:', { color, size, stock_quantity, price_adjustment, is_available });
    
    // Get product name for SKU
    const product = await db.getOne(
      'SELECT product_name FROM products WHERE product_id = $1',
      [id]
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Generate unique SKU with timestamp
    const timestamp = Date.now().toString().slice(-6);
    const sku = `${product.product_name.substring(0, 3).toUpperCase()}-${color?.substring(0, 1) || 'X'}-${size || 'OS'}-${timestamp}`;
    
    const variant = await db.insert(
      `INSERT INTO product_variants (product_id, color, size, sku, price_adjustment, stock_quantity, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, color, size, sku, price_adjustment || 0, stock_quantity || 0, is_available !== false]
    );
    
    console.log('Variant created successfully:', variant);
    
    res.status(201).json({ success: true, data: variant });
  } catch (error) {
    console.error('Create variant error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PUT /api/products/variants/:id
=========================== */
export const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, size, price_adjustment, stock_quantity, is_available } = req.body;
    
    console.log('Updating variant:', id);
    console.log('New values:', { color, size, stock_quantity, price_adjustment, is_available });
    
    await db.update(
      `UPDATE product_variants 
       SET color = $1, size = $2, price_adjustment = $3, stock_quantity = $4, is_available = $5
       WHERE variant_id = $6`,
      [color, size, price_adjustment, stock_quantity, is_available !== false, id]
    );
    
    // Verify the update
    const updated = await db.getOne(
      'SELECT * FROM product_variants WHERE variant_id = $1',
      [id]
    );
    
    console.log('Variant updated successfully:', updated);
    
    res.json({ success: true, message: 'Variant updated successfully', data: updated });
  } catch (error) {
    console.error('Update variant error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /api/products/variants/:id
=========================== */
export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.deleteRecord('DELETE FROM product_variants WHERE variant_id = $1', [id]);
    
    res.json({ success: true, message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Delete variant error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PATCH /api/products/variants/:id/stock
=========================== */
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


/* ===========================
   POST /api/products/:id/bulk-pricing
   Add bulk pricing to a product
=========================== */
export const addBulkPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { min_quantity, price_per_unit, total_price, display_text } = req.body;
    
    if (!min_quantity || !total_price) {
      return res.status(400).json({ 
        success: false, 
        message: 'min_quantity and total_price are required' 
      });
    }
    
    const calculatedPricePerUnit = total_price / min_quantity;
    const calculatedDisplayText = display_text || `${min_quantity} for ₹${total_price}`;
    
    const bulkPricing = await db.insert(
      `INSERT INTO bulk_pricing (product_id, min_quantity, price_per_unit, display_text, is_active)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, min_quantity, calculatedPricePerUnit, calculatedDisplayText, true]
    );
    
    res.status(201).json({ success: true, data: bulkPricing });
  } catch (error) {
    console.error('Add bulk pricing error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PUT /api/products/bulk-pricing/:id
   Update bulk pricing
=========================== */
export const updateBulkPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { min_quantity, price_per_unit, total_price, display_text, is_active } = req.body;
    
    const calculatedPricePerUnit = total_price ? total_price / min_quantity : price_per_unit;
    const calculatedDisplayText = display_text || `${min_quantity} for ₹${total_price || (price_per_unit * min_quantity)}`;
    
    await db.update(
      `UPDATE bulk_pricing
       SET min_quantity = $1, price_per_unit = $2, display_text = $3, is_active = $4
       WHERE bulk_pricing_id = $5`,
      [min_quantity, calculatedPricePerUnit, calculatedDisplayText, is_active !== false, id]
    );
    
    res.json({ success: true, message: 'Bulk pricing updated successfully' });
  } catch (error) {
    console.error('Update bulk pricing error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /api/products/bulk-pricing/:id
   Delete bulk pricing
=========================== */
export const deleteBulkPricing = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.deleteRecord('DELETE FROM bulk_pricing WHERE bulk_pricing_id = $1', [id]);
    
    res.json({ success: true, message: 'Bulk pricing deleted successfully' });
  } catch (error) {
    console.error('Delete bulk pricing error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
