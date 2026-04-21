import express from 'express';
import { createVehicle } from '../controllers/vehicleController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorizeRoles('driver'),
  upload.array('images', 5),
  createVehicle
);

export default router;