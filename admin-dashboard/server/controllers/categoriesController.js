// controllers/categoriesController.js
import db from '../config/database.js';

/* ===========================
   GET /api/categories
=========================== */
export const getAllCategories = async (req, res) => {
  try {
    const { is_active } = req.query;
    
    let query = 'SELECT * FROM categories WHERE 1=1';
    const params = [];
    
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      query += ` AND is_active = $${params.length}`;
    }
    
    query += ' ORDER BY display_order ASC, category_name ASC';
    
    const categories = await db.getMany(query, params);
    
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET /api/categories/:id
=========================== */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await db.getOne(
      'SELECT * FROM categories WHERE category_id = $1',
      [id]
    );
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/categories
=========================== */
export const createCategory = async (req, res) => {
  try {
    const { category_name, display_order, is_active } = req.body;
    
    if (!category_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category name is required' 
      });
    }
    
    // Check if category already exists
    const existing = await db.getOne(
      'SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER($1)',
      [category_name]
    );
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category already exists' 
      });
    }
    
    const category = await db.insert(
      `INSERT INTO categories (category_name, display_order, is_active)
       VALUES ($1, $2, $3) RETURNING *`,
      [category_name, display_order || 0, is_active !== false]
    );
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PUT /api/categories/:id
=========================== */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, display_order, is_active } = req.body;
    
    if (!category_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category name is required' 
      });
    }
    
    // Check if another category has the same name
    const existing = await db.getOne(
      'SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER($1) AND category_id != $2',
      [category_name, id]
    );
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category name already exists' 
      });
    }
    
    await db.update(
      `UPDATE categories 
       SET category_name = $1, display_order = $2, is_active = $3
       WHERE category_id = $4`,
      [category_name, display_order || 0, is_active !== false, id]
    );
    
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /api/categories/:id
=========================== */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category is used in products
    const productsCount = await db.getOne(
      'SELECT COUNT(*) as count FROM products WHERE category = (SELECT category_name FROM categories WHERE category_id = $1)',
      [id]
    );
    
    if (productsCount && parseInt(productsCount.count) > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete category. ${productsCount.count} products are using this category.` 
      });
    }
    
    // Check if category is used in offers
    const offersCount = await db.getOne(
      'SELECT COUNT(*) as count FROM offers WHERE category = (SELECT category_name FROM categories WHERE category_id = $1)',
      [id]
    );
    
    if (offersCount && parseInt(offersCount.count) > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete category. ${offersCount.count} offers are using this category.` 
      });
    }
    
    await db.deleteRecord('DELETE FROM categories WHERE category_id = $1', [id]);
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PATCH /api/categories/:id/toggle
=========================== */
export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.update(
      'UPDATE categories SET is_active = NOT is_active WHERE category_id = $1',
      [id]
    );
    
    res.json({ success: true, message: 'Category status toggled successfully' });
  } catch (error) {
    console.error('Toggle category status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
