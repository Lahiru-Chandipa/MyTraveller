import express from 'express';
import { createVehicle } from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireProvider } from '../middleware/profileMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post(
  '/',
  protect,
  requireProvider,
  upload.array('images', 5),
  createVehicle
);

export default router;