import express from "express";
const router = express.Router();
import {
  signup,
  signin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  googleAuth,
  logout,
} from "../controllers/auth.controller.js";
import multerUpload from "../middlewares/multer.middleware.js";

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/google-auth", multerUpload.single("profilePicture"), googleAuth);
router.post("/logout", logout);

export default router;
