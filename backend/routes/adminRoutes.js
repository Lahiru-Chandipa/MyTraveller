import express from "express";
import { adminLogin, getDashboard, getAllUsers, getAllBookings } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);

router.get("/dashboard", protect, authorizeRoles("admin"), getDashboard);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/bookings", protect, authorizeRoles("admin"), getAllBookings);

export default router;