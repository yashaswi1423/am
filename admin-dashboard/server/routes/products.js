// routes/products.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  uploadProductImageFile,
  deleteProductImage,
  createVariant,
  updateVariant,
  deleteVariant,
  updateVariantStock,
  addBulkPricing,
  updateBulkPricing,
  deleteBulkPricing,
  upload
} from '../controllers/productsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Product routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

// Image routes
router.post('/:id/images', authenticateToken, uploadProductImage);
router.post('/:id/upload-image', authenticateToken, upload.single('image'), uploadProductImageFile);
router.delete('/images/:id', authenticateToken, deleteProductImage);

// Variant routes
router.post('/:id/variants', authenticateToken, createVariant);
router.put('/variants/:id', authenticateToken, updateVariant);
router.delete('/variants/:id', authenticateToken, deleteVariant);
router.patch('/variants/:id/stock', authenticateToken, updateVariantStock);

// Bulk pricing routes
router.post('/:id/bulk-pricing', authenticateToken, addBulkPricing);
router.put('/bulk-pricing/:id', authenticateToken, updateBulkPricing);
router.delete('/bulk-pricing/:id', authenticateToken, deleteBulkPricing);

export default router;
