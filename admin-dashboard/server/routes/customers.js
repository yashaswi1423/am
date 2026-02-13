import express from 'express';
const router = express.Router();
import controller from '../controllers/customersController.js';

// CORS middleware for all customer routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// GET all customers
router.get('/', controller.getAllCustomers);

// GET single customer by ID
router.get('/:id', controller.getCustomerById);

// GET customer by email
router.get('/email/:email', controller.getCustomerByEmail);

// POST create new customer
router.post('/', controller.createCustomer);

// PUT update customer
router.put('/:id', controller.updateCustomer);

// DELETE customer
router.delete('/:id', controller.deleteCustomer);

// GET customer orders
router.get('/:id/orders', controller.getCustomerOrders);

// GET customer statistics
router.get('/:id/stats', controller.getCustomerStats);

// PATCH update customer status
router.patch('/:id/status', controller.updateCustomerStatus);

export default router;