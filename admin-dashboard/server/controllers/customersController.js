// controllers/customersController.js
import db from '../config/database-postgres.js';

// GET /api/customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await db.getMany('SELECT * FROM customers ORDER BY created_at DESC');
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await db.getOne('SELECT * FROM customers WHERE customer_id = $1', [id]);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers/email/:email
export const getCustomerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const customer = await db.getOne('SELECT * FROM customers WHERE email = $1', [email]);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { email, password_hash, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country } = req.body;

    if (!email || !first_name || !last_name || !password_hash) {
      return res.status(400).json({ success: false, message: 'Email, first name, last name, and password are required' });
    }

    const existingCustomer = await db.getOne('SELECT customer_id FROM customers WHERE email = $1', [email]);

    if (existingCustomer) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const newId = await db.insert(
      'INSERT INTO customers (email, password_hash, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING customer_id',
      [email, password_hash, first_name, last_name, phone || null, address_line1 || null, address_line2 || null, city || null, state || null, postal_code || null, country || 'India']
    );

    // Fetch the newly created customer
    const newCustomer = await db.getOne('SELECT * FROM customers WHERE customer_id = $1', [newId]);

    res.status(201).json({ success: true, data: newCustomer, message: 'Customer created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country } = req.body;

    const affectedRows = await db.update(
      'UPDATE customers SET email = $1, first_name = $2, last_name = $3, phone = $4, address_line1 = $5, address_line2 = $6, city = $7, state = $8, postal_code = $9, country = $10 WHERE customer_id = $11',
      [email, first_name, last_name, phone, address_line1, address_line2, city, state, postal_code, country, id]
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await db.deleteRecord('DELETE FROM customers WHERE customer_id = $1', [id]);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers/:id/orders
export const getCustomerOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await db.getMany(
      'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers/:id/stats
export const getCustomerStats = async (req, res) => {
  try {
    const { id } = req.params;

    const stats = await db.getOne(
      `SELECT 
         COUNT(*) as total_orders,
         COALESCE(SUM(total_amount), 0) as total_spent,
         COALESCE(AVG(total_amount), 0) as avg_order_value
       FROM orders 
       WHERE customer_id = $1`,
      [id]
    );

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/customers/:id/status
export const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return res.status(400).json({ success: false, message: 'is_active is required' });
    }

    const affectedRows = await db.update(
      'UPDATE customers SET is_active = $1 WHERE customer_id = $2',
      [is_active, id]
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders,
  getCustomerStats,
  updateCustomerStatus
};
