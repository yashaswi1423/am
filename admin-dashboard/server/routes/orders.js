import express from 'express';
const router = express.Router();

import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
} from '../controllers/ordersController.js';

// CORS middleware for all order routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// GET all orders
router.get('/', getAllOrders);

// GET single order by ID
router.get('/:id', getOrderById);

// POST create new order
router.post('/', createOrder);

// PATCH update order status
router.patch('/:id/status', updateOrderStatus);

// DELETE order
router.delete('/:id', deleteOrder);

export default router;
