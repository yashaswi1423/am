// controllers/analyticsController.js
import db from '../config/database.js';

// GET /api/analytics/overview
export const getOverview = async (req, res) => {
  try {
    const totalRevenue = await db.getOne(
      'SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE order_status = ?',
      ['delivered']
    );

    const totalOrders = await db.getOne(
      'SELECT COUNT(*) as total FROM orders'
    );

    const totalCustomers = await db.getOne(
      'SELECT COUNT(*) as total FROM customers'
    );

    const totalProducts = await db.getOne(
      'SELECT COUNT(*) as total FROM products WHERE is_active = TRUE'
    );

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue.total || 0,
        totalOrders: totalOrders.total || 0,
        totalCustomers: totalCustomers.total || 0,
        totalProducts: totalProducts.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/sales
export const getSalesData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let sql = 'SELECT DATE(created_at) as date, COUNT(*) as sales, SUM(total_amount) as revenue FROM orders';
    const params = [];

    if (startDate && endDate) {
      sql += ' WHERE created_at BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    sql += ' GROUP BY DATE(created_at) ORDER BY date DESC';

    const salesData = await db.getMany(sql, params);

    res.json({ success: true, data: salesData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/revenue
export const getRevenueData = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;

    let groupBy = 'DATE(created_at)';
    let selectPeriod = 'DATE(created_at)';
    
    if (period === 'monthly') {
      // PostgreSQL compatible
      groupBy = "TO_CHAR(created_at, 'YYYY-MM')";
      selectPeriod = "TO_CHAR(created_at, 'YYYY-MM')";
    } else if (period === 'yearly') {
      groupBy = 'EXTRACT(YEAR FROM created_at)';
      selectPeriod = 'EXTRACT(YEAR FROM created_at)';
    }

    const revenueData = await db.getMany(
      `SELECT ${selectPeriod} as period, SUM(total_amount) as revenue 
       FROM orders 
       WHERE order_status = ? 
       GROUP BY ${groupBy} 
       ORDER BY period DESC 
       LIMIT 30`,
      ['delivered']
    );

    res.json({ success: true, data: revenueData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/top-products
export const getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await db.getMany(
      `SELECT p.product_id, p.product_name, p.base_price, 
              COUNT(oi.order_item_id) as order_count, 
              SUM(oi.quantity) as total_sold,
              SUM(oi.subtotal) as total_revenue
       FROM products p
       INNER JOIN order_items oi ON p.product_id = oi.product_id
       GROUP BY p.product_id
       ORDER BY total_sold DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json({ success: true, data: topProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/top-customers
export const getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topCustomers = await db.getMany(
      `SELECT c.customer_id, (c.first_name || ' ' || c.last_name) as name, c.email,
              COUNT(o.order_id) as order_count,
              SUM(o.total_amount) as total_spent
       FROM customers c
       INNER JOIN orders o ON c.customer_id = o.customer_id
       GROUP BY c.customer_id, c.first_name, c.last_name, c.email
       ORDER BY total_spent DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json({ success: true, data: topCustomers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/orders-by-status
export const getOrdersByStatus = async (req, res) => {
  try {
    const ordersByStatus = await db.getMany(
      `SELECT order_status, COUNT(*) as count, SUM(total_amount) as total_amount
       FROM orders
       GROUP BY order_status`
    );

    res.json({ success: true, data: ordersByStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/monthly-trends
export const getMonthlyTrends = async (req, res) => {
  try {
    const monthlyTrends = await db.getMany(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as month,
         COUNT(*) as orders,
         SUM(total_amount) as revenue,
         AVG(total_amount) as avg_order_value
       FROM orders
       WHERE created_at >= NOW() - INTERVAL '12 months'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM')
       ORDER BY month DESC`
    );

    res.json({ success: true, data: monthlyTrends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getOverview,
  getSalesData,
  getRevenueData,
  getTopProducts,
  getTopCustomers,
  getOrdersByStatus,
  getMonthlyTrends
};


