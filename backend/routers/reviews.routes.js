import express from "express";
import {
  createReview,
  getPackageReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  voteHelpful,
  getReviewStats,
} from "../controllers/reviews.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

// Public routes
router.get("/package/:packageId", getPackageReviews);

// User routes
router.post("/", verifyToken, createReview);
router.get("/my-reviews", verifyToken, getUserReviews);
router.put("/:reviewId", verifyToken, updateReview);
router.delete("/:reviewId", verifyToken, deleteReview);
router.post("/:reviewId/vote", verifyToken, voteHelpful);

// Admin routes
router.get("/admin/stats", verifyToken, getReviewStats);

export default router;
