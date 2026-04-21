import express from "express";
import { payBooking } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, payBooking);

export default router;