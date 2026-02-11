import express from 'express';
const router = express.Router();
import controller from '../controllers/analyticsController.js';

// GET overall analytics overview
router.get('/overview', controller.getOverview);

// GET sales analytics
router.get('/sales', controller.getSalesData);

// GET revenue data
router.get('/revenue', controller.getRevenueData);

// GET top products
router.get('/top-products', controller.getTopProducts);

// GET top customers
router.get('/top-customers', controller.getTopCustomers);

// GET orders by status
router.get('/orders-by-status', controller.getOrdersByStatus);

// GET monthly trends
router.get('/monthly-trends', controller.getMonthlyTrends);

export default router;