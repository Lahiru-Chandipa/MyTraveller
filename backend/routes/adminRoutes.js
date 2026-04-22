import express from "express";
import { adminLogin, getDashboard, getAllUsers, getAllBookings } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { approveDriver, approveHotel } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.get("/dashboard", protect, authorizeRoles("admin"), getDashboard);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/bookings", protect, authorizeRoles("admin"), getAllBookings);

router.put("/drivers/:id/approve", protect, authorizeRoles("admin"), approveDriver);
router.put("/hotels/:id/approve", protect, authorizeRoles("admin"), approveHotel);

export default router;