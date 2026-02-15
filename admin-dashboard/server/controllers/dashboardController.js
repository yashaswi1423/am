// controllers/dashboardController.js
import db from '../config/database.js';

// GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    
    const totalRevenue = await db.getOne(
      'SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE order_status = ?',
      ['delivered']
    );

    const totalOrders = await db.getOne('SELECT COUNT(*) as total FROM orders');

    const totalCustomers = await db.getOne('SELECT COUNT(*) as total FROM customers');

    const totalProducts = await db.getOne('SELECT COUNT(*) as total FROM products WHERE is_active = TRUE');

    const pendingOrders = await db.getOne(
      'SELECT COUNT(*) as total FROM orders WHERE order_status = ?',
      ['pending']
    );

    const lowStockCount = await db.getOne(
      'SELECT COUNT(DISTINCT pv.product_id) as total FROM product_variants pv WHERE pv.stock_quantity < 10'
    );

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue.total || 0,
        totalOrders: totalOrders.total || 0,
        totalCustomers: totalCustomers.total || 0,
        totalProducts: totalProducts.total || 0,
        pendingOrders: pendingOrders.total || 0,
        lowStockCount: lowStockCount.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/recent-orders
export const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentOrders = await db.getMany(
      `SELECT o.*, (c.first_name || ' ' || c.last_name) as customer_name, c.email as customer_email
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       ORDER BY o.created_at DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json({ success: true, data: recentOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/recent-customers
export const getRecentCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentCustomers = await db.getMany(
      'SELECT * FROM customers ORDER BY created_at DESC LIMIT ?',
      [parseInt(limit)]
    );

    res.json({ success: true, data: recentCustomers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/low-stock
export const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const lowStockProducts = await db.getMany(
      `SELECT p.*, pv.variant_id, pv.size, pv.color, pv.stock_quantity 
       FROM products p
       INNER JOIN product_variants pv ON p.product_id = pv.product_id
       WHERE pv.stock_quantity < ?
       ORDER BY pv.stock_quantity ASC`,
      [parseInt(threshold)]
    );

    res.json({ success: true, data: lowStockProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/revenue-chart
export const getRevenueChart = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const revenueData = await db.getMany(
      `SELECT 
         DATE(created_at) as date,
         COALESCE(SUM(total_amount), 0) as revenue,
         COUNT(*) as orders
       FROM orders
       WHERE created_at >= NOW() - INTERVAL '? days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [parseInt(days)]
    );

    res.json({ success: true, data: revenueData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/activity-log
export const getActivityLog = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Note: activity_log table doesn't exist in schema, array
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getDashboardStats,
  getRecentOrders,
  getRecentCustomers,
  getLowStockProducts,
  getRevenueChart,
  getActivityLog
};

