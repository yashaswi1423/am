// controllers/ordersController.js
import db from '../config/database.js';

/* ===========================
   GET /api/orders
=========================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await db.getMany(
      `SELECT 
        o.order_id,
        o.order_number,
        o.customer_id,
        o.order_status,
        o.payment_status,
        o.subtotal,
        o.total_amount,
        o.shipping_address,
        o.created_at,
        o.updated_at,
        (c.first_name || ' ' || c.last_name) AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        COUNT(oi.order_item_id) as item_count
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       GROUP BY o.order_id, o.order_number, o.customer_id, o.order_status, 
                o.payment_status, o.subtotal, o.total_amount, o.shipping_address,
                o.created_at, o.updated_at, c.first_name, c.last_name, c.email, c.phone
       ORDER BY o.created_at DESC`
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET /api/orders/:id
=========================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await db.getOne(
      `SELECT 
        o.*,
        (c.first_name || ' ' || c.last_name) AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       WHERE o.order_id = ?`,
      [req.params.id]
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Fetch order items
    const orderItems = await db.getMany(
      `SELECT 
        oi.*,
        p.product_name as original_product_name,
        p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    order.items = orderItems;

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/orders
=========================== */
export const createOrder = async (req, res) => {
  try {
    console.log('Received order request:', JSON.stringify(req.body, null, 2));
    
    const { 
      customer_id, 
      items, 
      shipping_address, 
      billing_address, 
      coupon_code,
      subtotal,
      total_amount,
      discount_amount = 0,
      tax_amount = 0,
      shipping_cost = 0,
      payment_method = 'cod',
      order_status = 'pending',
      payment_status = 'pending'
    } = req.body;

    if (!customer_id || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer and items are required' });
    }
    
    if (!shipping_address) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate totals if not provided
    let calculatedSubtotal = subtotal || 0;
    if (!subtotal) {
      calculatedSubtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    }
    const calculatedTotal = total_amount || calculatedSubtotal;

    // Create order with all required fields
    const orderId = await db.insert(
      `INSERT INTO orders (
        order_number, customer_id, order_status, payment_status, 
        subtotal, discount_amount, tax_amount, shipping_cost, total_amount, 
        shipping_address, billing_address, coupon_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber, 
        customer_id, 
        order_status, 
        payment_status, 
        calculatedSubtotal, 
        discount_amount,
        tax_amount,
        shipping_cost,
        calculatedTotal, 
        shipping_address, 
        billing_address || shipping_address, 
        coupon_code || null
      ]
    );

    // Insert order items
    for (const item of items) {
      const itemSubtotal = item.subtotal || (item.unit_price * item.quantity);

      await db.insert(
        `INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_details, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id || null, item.variant_id || null, item.product_name, item.variant_details || null, item.quantity, item.unit_price, itemSubtotal]
      );
    }

    // Create payment record
    await db.insert(
      `INSERT INTO payments (order_id, payment_method, payment_status, amount)
       VALUES (?, ?, ?, ?)`,
      [orderId, payment_method, payment_status, calculatedTotal]
    );

    res.status(201).json({ 
      success: true, 
      data: { 
        order_id: orderId, 
        order_number: orderNumber 
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PATCH /api/orders/:id/status
=========================== */
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  try {
    const affected = await db.update(
      'UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      [status, req.params.id]
    );

    if (!affected) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE /api/orders/:id
=========================== */
export const deleteOrder = async (req, res) => {
  try {
    // Delete order items first (foreign key constraint)
    await db.deleteRecord(
      'DELETE FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    // Delete the order
    const affected = await db.deleteRecord(
      'DELETE FROM orders WHERE order_id = ?',
      [req.params.id]
    );

    if (!affected) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


