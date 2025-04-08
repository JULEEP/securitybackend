import express from 'express';
import * as userInfoController from '../controllers/userInfoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected by authentication middleware
router.use(protect);

// Create user basic information
router.post('/basic', userInfoController.createBasicInfo);

// Get user basic information
router.get('/basic/:userId?', userInfoController.getBasicInfo);

// Update user basic information
router.put('/basic/:userId?', userInfoController.updateBasicInfo);

// Delete user basic information
router.delete('/basic/:userId?', userInfoController.deleteBasicInfo);

export default router;
