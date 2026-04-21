import express from "express";
import { createPackage, getPackages } from "../controllers/packageController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("hotel", "driver"),
  upload.array("images", 5),
  createPackage
);

router.get("/", getPackages);

export default router;