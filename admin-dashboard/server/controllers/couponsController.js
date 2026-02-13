// controllers/couponsController.js
import db from '../config/database.js';

// GET /api/coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await db.getMany('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/coupons/:id
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await db.getOne('SELECT * FROM coupons WHERE coupon_id = ?', [id]);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/coupons
export const createCoupon = async (req, res) => {
  try {
    const { coupon_code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_until } = req.body;

    if (!coupon_code || !discount_type || !discount_value || !valid_from || !valid_until) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newId = await db.insert(
      `INSERT INTO coupons (coupon_code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_until) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [coupon_code, description || null, discount_type, discount_value, min_order_value || 0, max_discount || null, usage_limit || null, valid_from, valid_until]
    );

    res.status(201).json({ success: true, data: { id: newId }, message: 'Coupon created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/coupons/:id
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { coupon_code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, is_active, valid_from, valid_until } = req.body;

    const affectedRows = await db.update(
      `UPDATE coupons 
       SET coupon_code = ?, description = ?, discount_type = ?, discount_value = ?, min_order_value = ?, max_discount = ?, usage_limit = ?, is_active = ?, valid_from = ?, valid_until = ?
       WHERE coupon_id = ?`,
      [coupon_code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, is_active, valid_from, valid_until, id]
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, message: 'Coupon updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await db.deleteRecord('DELETE FROM coupons WHERE coupon_id = ?', [id]);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { coupon_code, order_amount } = req.body;

    if (!coupon_code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = await db.getOne('SELECT * FROM coupons WHERE coupon_code = ?', [coupon_code]);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (!coupon.is_active) {
      return res.status(400).json({ success: false, message: 'Coupon is inactive' });
    }

    const now = new Date();
    if (new Date(coupon.valid_from) > now) {
      return res.status(400).json({ success: false, message: 'Coupon is not yet valid' });
    }

    if (new Date(coupon.valid_until) < now) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (order_amount && coupon.min_order_value && order_amount < coupon.min_order_value) {
      return res.status(400).json({ success: false, message: `Minimum order value is ${coupon.min_order_value}` });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (order_amount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else if (coupon.discount_type === 'fixed') {
      discount = coupon.discount_value;
    }

    res.json({ 
      success: true, 
      data: { 
        valid: true, 
        discount,
        coupon 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/coupons/:id/toggle-status
export const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await db.getOne('SELECT is_active FROM coupons WHERE coupon_id = ?', [id]);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const newStatus = !coupon.is_active;

    await db.update('UPDATE coupons SET is_active = ? WHERE coupon_id = ?', [newStatus, id]);

    res.json({ success: true, message: `Coupon ${newStatus ? 'activated' : 'deactivated'}`, data: { is_active: newStatus } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  toggleCouponStatus
};


