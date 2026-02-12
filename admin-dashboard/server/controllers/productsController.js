// controllers/productsController.js
import db from '../config/database-postgres.js';

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await db.getMany('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.getOne('SELECT * FROM products WHERE product_id = $1', [id]);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { product_name, description, category, brand, base_price, discount_percentage, is_featured, image_url } = req.body;

    if (!product_name || !base_price || !category) {
      return res.status(400).json({ success: false, message: 'Product name, category, and base price are required' });
    }

    const newId = await db.insert(
      'INSERT INTO products (product_name, description, category, brand, base_price, discount_percentage, is_featured, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING product_id',
      [product_name, description || null, category, brand || null, base_price, discount_percentage || 0, is_featured || false, image_url || null]
    );

    res.status(201).json({ success: true, data: { id: newId }, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, description, category, brand, base_price, discount_percentage, is_active, is_featured, image_url } = req.body;

    const affectedRows = await db.update(
      'UPDATE products SET product_name = $1, description = $2, category = $3, brand = $4, base_price = $5, discount_percentage = $6, is_active = $7, is_featured = $8, image_url = $9 WHERE product_id = $10',
      [product_name, description, category, brand, base_price, discount_percentage, is_active, is_featured, image_url, id]
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await db.deleteRecord('DELETE FROM products WHERE product_id = $1', [id]);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/products/:id/stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { variant_id, stock_quantity } = req.body;

    if (stock_quantity === undefined) {
      return res.status(400).json({ success: false, message: 'stock_quantity is required' });
    }

    if (variant_id) {
      const affectedRows = await db.update(
        'UPDATE product_variants SET stock_quantity = $1 WHERE variant_id = $2',
        [stock_quantity, variant_id]
      );

      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Product variant not found' });
      }
    }

    res.json({ success: true, message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/category/:category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await db.getMany('SELECT * FROM products WHERE category = $1 AND is_active = TRUE', [category]);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/search
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const products = await db.getMany(
      'SELECT * FROM products WHERE product_name ILIKE $1 OR description ILIKE $2 OR brand ILIKE $3',
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getProductsByCategory,
  searchProducts
};
