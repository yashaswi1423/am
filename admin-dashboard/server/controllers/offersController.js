// controllers/offersController.js
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
   GET /api/offers
=========================== */
export const getAllOffers = async (req, res) => {
  try {
    const { is_active, is_featured } = req.query;
    
    let query = `
      SELECT 
        o.*,
        COALESCE(
          json_agg(jsonb_build_object(
            'image_id', oi.image_id,
            'image_url', oi.image_url,
            'display_order', oi.display_order,
            'is_primary', oi.is_primary
          ) ORDER BY oi.display_order) FILTER (WHERE oi.image_id IS NOT NULL),
          '[]'
        ) as images,
        COALESCE(
          json_agg(jsonb_build_object(
            'variant_id', ov.variant_id,
            'color', ov.color,
            'size', ov.size,
            'sku', ov.sku,
            'price_adjustment', ov.price_adjustment,
            'stock_quantity', ov.stock_quantity,
            'is_available', ov.is_available
          )) FILTER (WHERE ov.variant_id IS NOT NULL),
          '[]'
        ) as variants
      FROM offers o
      LEFT JOIN offer_images oi ON o.offer_id = oi.offer_id
      LEFT JOIN offer_variants ov ON o.offer_id = ov.offer_id
      WHERE 1=1
    `;
    
    const params = [];
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      query += ` AND o.is_active = $${params.length}`;
    }
    if (is_featured !== undefined) {
      params.push(is_featured === 'true');
      query += ` AND o.is_featured = $${params.length}`;
    }
    
    // Only show offers that are currently valid
    query += ` AND (o.valid_until IS NULL OR o.valid_until > CURRENT_TIMESTAMP)`;
    query += ` GROUP BY o.offer_id ORDER BY o.created_at DESC`;
    
    const offers = await db.getMany(query, params);
    
    res.json({ success: true, data: offers });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET /api/offers/:id
=========================== */
export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const offer = await db.getOne(
      `SELECT 
        o.*,
        COALESCE(
          json_agg(jsonb_build_object(
            'image_id', oi.image_id,
            'image_url', oi.image_url,
            'display_order', oi.display_order,
            'is_primary', oi.is_primary
          ) ORDER BY oi.display_order) FILTER (WHERE oi.image_id IS NOT NULL),
          '[]'
        ) as images,
        COALESCE(
          json_agg(jsonb_build_object(
            'variant_id', ov.variant_id,
            'color', ov.color,
            'size', ov.size,
            'sku', ov.sku,
            'price_adjustment', ov.price_adjustment,
            'stock_quantity', ov.stock_quantity,
            'is_available', ov.is_available
          )) FILTER (WHERE ov.variant_id IS NOT NULL),
          '[]'
        ) as variants
      FROM offers o
      LEFT JOIN offer_images oi ON o.offer_id = oi.offer_id
      LEFT JOIN offer_variants ov ON o.offer_id = ov.offer_id
      WHERE o.offer_id = $1
      GROUP BY o.offer_id`,
      [id]
    );
    
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    
    res.json({ success: true, data: offer });
  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/offers
=========================== */
export const createOffer = async (req, res) => {
  try {
    console.log('=== CREATE OFFER REQUEST ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const { 
      name, 
      description, 
      original_price, 
      offer_price, 
      stock_quantity,
      category,
      is_active,
      is_featured,
      valid_until,
      variants
    } = req.body;
    
    // Validation
    if (!name || !original_price || !offer_price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Offer name, original price, and offer price are required'
      });
    }
    
    const originalPriceNum = parseFloat(original_price);
    const offerPriceNum = parseFloat(offer_price);
    const stockNum = parseInt(stock_quantity) || 0;
    
    if (isNaN(originalPriceNum) || originalPriceNum <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid original price value'
      });
    }
    
    if (isNaN(offerPriceNum) || offerPriceNum <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid offer price value'
      });
    }
    
    if (offerPriceNum >= originalPriceNum) {
      return res.status(400).json({ 
        success: false, 
        message: 'Offer price must be less than original price'
      });
    }
    
    console.log('✅ Validation passed, creating offer...');
    
    const offer = await db.insert(
      `INSERT INTO offers (
        offer_name, description, original_price, offer_price, 
        stock_quantity, category, is_active, is_featured, valid_until
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        name, 
        description || '', 
        originalPriceNum, 
        offerPriceNum, 
        stockNum,
        category || 'Special Offers',
        is_active !== false,
        is_featured || false,
        valid_until || null
      ]
    );
    
    console.log('✅ Offer created:', offer);
    
    // Insert variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      console.log(`Inserting ${variants.length} variants...`);
      for (const variant of variants) {
        await db.insert(
          `INSERT INTO offer_variants (
            offer_id, size, color, sku, stock_quantity, 
            price_adjustment, is_available
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            offer.offer_id,
            variant.size,
            variant.color,
            variant.sku,
            parseInt(variant.stock_quantity) || 0,
            parseFloat(variant.price_adjustment) || 0,
            variant.is_available !== false
          ]
        );
      }
      console.log('✅ Variants inserted');
    }
    
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    console.error('❌ Create offer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PUT /api/offers/:id
=========================== */
export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      original_price, 
      offer_price, 
      stock_quantity,
      category,
      is_active,
      is_featured,
      valid_until,
      variants
    } = req.body;
    
    console.log('Updating offer:', { id, name, original_price, offer_price });
    
    await db.update(
      `UPDATE offers 
       SET offer_name = $1, description = $2, original_price = $3, 
           offer_price = $4, stock_quantity = $5, category = $6,
           is_active = $7, is_featured = $8, valid_until = $9
       WHERE offer_id = $10`,
      [
        name, 
        description, 
        parseFloat(original_price), 
        parseFloat(offer_price),
        parseInt(stock_quantity),
        category,
        is_active !== false,
        is_featured || false,
        valid_until || null,
        id
      ]
    );
    
    // Update variants if provided
    if (variants && Array.isArray(variants)) {
      console.log(`Updating variants for offer ${id}...`);
      
      // Delete existing variants
      await db.deleteRecord('DELETE FROM offer_variants WHERE offer_id = $1', [id]);
      
      // Insert new variants
      for (const variant of variants) {
        await db.insert(
          `INSERT INTO offer_variants (
            offer_id, size, color, sku, stock_quantity, 
            price_adjustment, is_available
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            id,
            variant.size,
            variant.color,
            variant.sku,
            parseInt(variant.stock_quantity) || 0,
            parseFloat(variant.price_adjustment) || 0,
            variant.is_available !== false
          ]
        );
      }
      console.log('✅ Variants updated');
    }
    
    res.json({ success: true, message: 'Offer updated successfully' });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /api/offers/:id
=========================== */
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get all images to delete from storage
    const images = await db.getMany(
      'SELECT image_url FROM offer_images WHERE offer_id = $1',
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
    
    // Delete offer (cascade will delete images and variants)
    await db.deleteRecord('DELETE FROM offers WHERE offer_id = $1', [id]);
    
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/offers/:id/images
=========================== */
export const uploadOfferImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;
    
    if (!image_url) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }
    
    // Get current image count
    const result = await db.getOne(
      'SELECT COUNT(*) as count FROM offer_images WHERE offer_id = $1',
      [id]
    );
    
    const count = parseInt(result.count);
    
    // Insert image record
    const image = await db.insert(
      `INSERT INTO offer_images (offer_id, image_url, display_order, is_primary)
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
   POST /api/offers/:id/upload-image (File Upload)
=========================== */
export const uploadOfferImageFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Upload offer image file - Offer ID:', id);
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid offer ID' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Upload to Supabase Storage
    const fileName = `offer-${id}-${Date.now()}.${req.file.mimetype.split('/')[1]}`;
    console.log('Uploading to Supabase:', fileName);
    const uploadResult = await uploadToSupabase(req.file.buffer, fileName, req.file.mimetype, 'offer-images');
    const imageUrl = uploadResult.url;
    console.log('Image uploaded successfully:', imageUrl);
    
    // Get current image count
    const countResult = await db.getOne(
      'SELECT COUNT(*) as count FROM offer_images WHERE offer_id = $1',
      [id]
    );
    
    const count = parseInt(countResult.count);
    console.log('Current image count:', count);
    
    // Insert image record
    const image = await db.insert(
      `INSERT INTO offer_images (offer_id, image_url, display_order, is_primary)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, imageUrl, count, count === 0]
    );
    
    console.log('Image record created:', image);
    res.json({ success: true, data: image, imageUrl });
  } catch (error) {
    console.error('Upload offer image file error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /api/offers/images/:id
=========================== */
export const deleteOfferImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get image URL
    const image = await db.getOne(
      'SELECT image_url FROM offer_images WHERE image_id = $1',
      [id]
    );
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Delete from storage
    await deleteFromSupabase(image.image_url);
    
    // Delete from database
    await db.deleteRecord('DELETE FROM offer_images WHERE image_id = $1', [id]);
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PATCH /api/offers/:id/stock
=========================== */
export const updateOfferStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    
    await db.update(
      'UPDATE offers SET stock_quantity = $1 WHERE offer_id = $2',
      [stock_quantity, id]
    );
    
    res.json({ success: true, message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
