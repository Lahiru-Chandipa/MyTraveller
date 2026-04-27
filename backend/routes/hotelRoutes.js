import express from 'express';
import { createHotel, getHotels } from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';


// APPLY AS HOTEL
router.post(
  '/',
  protect,
  upload.array('images', 5),
  createHotel
);

router.get('/', getHotels);

export default router;