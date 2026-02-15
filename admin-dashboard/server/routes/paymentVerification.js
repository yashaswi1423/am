// routes/paymentVerification.js
import express from 'express';
import {
  submitPaymentVerification,
  getPendingVerifications,
  getAllVerifications,
  getVerificationById,
  verifyPayment,
  rejectPayment,
  getScreenshot,
  getVerificationByOrderId,
  getVerificationStats,
  uploadMiddleware
} from '../controllers/paymentVerificationController.js';

const router = express.Router();

// Public routes (for customers)
router.post('/submit', (req, res, next) => {
  // Explicit CORS for this critical endpoint
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
}, uploadMiddleware, submitPaymentVerification);

router.get('/order/:orderId', getVerificationByOrderId);

// Admin routes (should be protected with auth middleware in production)
router.get('/pending', getPendingVerifications);
router.get('/all', getAllVerifications);
router.get('/stats', getVerificationStats);
router.get('/:id', getVerificationById);
router.post('/:id/verify', verifyPayment);
router.post('/:id/reject', rejectPayment);

// Screenshot serving
router.get('/screenshot/:filename', getScreenshot);

export default router;
