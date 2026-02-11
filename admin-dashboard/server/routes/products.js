import express from 'express';
const router = express.Router();
import controller from '../controllers/productsController.js';

// GET all products
router.get('/', controller.getAllProducts);

// GET single product by ID
router.get('/:id', controller.getProductById);

// POST create new product
router.post('/', controller.createProduct);

// PUT update product
router.put('/:id', controller.updateProduct);

// DELETE product
router.delete('/:id', controller.deleteProduct);

// GET products by category
router.get('/category/:category', controller.getProductsByCategory);

// PUT update product stock
router.put('/:id/stock', controller.updateStock);

// GET search products
router.get('/search/query', controller.searchProducts);

export default router;