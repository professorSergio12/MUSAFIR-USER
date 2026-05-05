import express from "express";
import {
  getUserBookings,
  getBookingById,
} from "../controllers/bookings.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

// Get current user's bookings (must be before /:id route)
router.get("/my", verifyToken, getUserBookings);
router.get("/:id", verifyToken, getBookingById);

export default router;
