import express from 'express';
import { createDriver } from '../controllers/driverController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('driver'), createDriver);

export default router;