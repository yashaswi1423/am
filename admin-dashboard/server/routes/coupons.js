import express from 'express';
const router = express.Router();
import controller from '../controllers/couponsController.js';

// GET all coupons
router.get('/', controller.getAllCoupons);

// GET single coupon by ID
router.get('/:id', controller.getCouponById);

// POST create new coupon
router.post('/', controller.createCoupon);

// PUT update coupon
router.put('/:id', controller.updateCoupon);

// DELETE coupon
router.delete('/:id', controller.deleteCoupon);

// POST validate coupon
router.post('/validate', controller.validateCoupon);

// PATCH toggle coupon status
router.patch('/:id/toggle-status', controller.toggleCouponStatus);

export default router;