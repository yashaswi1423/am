import express from 'express';
const router = express.Router();

import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
} from '../controllers/ordersController.js';

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
