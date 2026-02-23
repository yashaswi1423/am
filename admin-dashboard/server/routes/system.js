// routes/system.js
import express from 'express';
import {
  getAllSettings,
  getSettingByKey,
  updateSetting,
  toggleMaintenanceMode,
  getMaintenanceStatus,
  fixDisabledVariants
} from '../controllers/systemController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/maintenance/status', getMaintenanceStatus);

// Protected routes (admin only)
router.get('/settings', authenticateToken, getAllSettings);
router.get('/settings/:key', authenticateToken, getSettingByKey);
router.put('/settings/:key', authenticateToken, updateSetting);
router.post('/maintenance/toggle', authenticateToken, toggleMaintenanceMode);
router.post('/fix-variants', authenticateToken, fixDisabledVariants);

export default router;
