// routes/offers.js
import express from 'express';
import {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  uploadOfferImage,
  uploadOfferImageFile,
  deleteOfferImage,
  updateOfferStock,
  upload
} from '../controllers/offersController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (for customer-facing website)
router.get('/', getAllOffers);
router.get('/:id', getOfferById);

// Protected routes (admin only)
router.post('/', authenticateToken, createOffer);
router.put('/:id', authenticateToken, updateOffer);
router.delete('/:id', authenticateToken, deleteOffer);

// Image management
router.post('/:id/images', authenticateToken, uploadOfferImage);
router.post('/:id/upload-image', authenticateToken, upload.single('image'), uploadOfferImageFile);
router.delete('/images/:id', authenticateToken, deleteOfferImage);

// Stock management
router.patch('/:id/stock', authenticateToken, updateOfferStock);

export default router;
