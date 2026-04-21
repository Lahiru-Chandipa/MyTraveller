import express from 'express';
import { createHotel, getHotels } from '../controllers/hotelController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorizeRoles('hotel'),
  upload.array('images', 5),
  createHotel
);

router.get('/', getHotels);

export default router;