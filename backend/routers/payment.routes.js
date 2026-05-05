import express from "express";
const router = express.Router();
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/verify.js";

router.post("/create-order", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);
export default router;
