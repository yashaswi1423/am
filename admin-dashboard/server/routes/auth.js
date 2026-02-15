// routes/auth.js
import express from 'express';
import { requestLoginApproval, checkApprovalStatus, handleApprovalAction } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/request-approval - Request login approval
router.post('/request-approval', requestLoginApproval);

// GET /api/auth/check-status - Check approval status
router.get('/check-status', checkApprovalStatus);

// GET /api/auth/approve-login - Handle approval/rejection from email
router.get('/approve-login', handleApprovalAction);

export default router;
