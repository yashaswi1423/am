import express from 'express';
const router = express.Router();
import controller from '../controllers/dashboardController.js';

// GET dashboard overview statistics
router.get('/stats', controller.getDashboardStats);

// GET recent orders
router.get('/recent-orders', controller.getRecentOrders);

// GET recent customers
router.get('/recent-customers', controller.getRecentCustomers);

// GET low stock products
router.get('/low-stock', controller.getLowStockProducts);

// GET revenue chart data
router.get('/revenue-chart', controller.getRevenueChart);

// GET activity log
router.get('/activity-log', controller.getActivityLog);

export default router;