import express from 'express';
import { createDriver } from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// APPLY AS DRIVER
router.post('/', protect, createDriver);

export default router;