import crypto from "crypto";
import instance from "../config/payment.config.js";
import Booking from "../models/booking.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return next(errorHandler(400, "Invalid amount"));
    }

    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      message: "Order created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      packageId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return next(errorHandler(400, "Missing payment details"));
    }

    if (!packageId) {
      return next(errorHandler(400, "Package ID is required"));
    }

    if (!amount || amount <= 0) {
      return next(errorHandler(400, "Invalid amount"));
    }

    // Create HMAC SHA256 signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return next(errorHandler(400, "Invalid payment signature"));
    }

    const booking = await Booking.create({
      packageId,
      amount,
      user: req.user?._id || null,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "Confirmed",
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed",
      booking,
    });
  } catch (error) {
    next(error);
  }
};
