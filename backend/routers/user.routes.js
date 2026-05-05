import express from "express";
const router = express.Router();
import { updateUserName, profilePictureUpload } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verify.js";
import multerUpload from "../middlewares/multer.middleware.js";

router.put("/update-name", verifyToken, updateUserName);
router.post("/profile-picture", verifyToken, multerUpload.single("profilePicture"), profilePictureUpload);

export default router;
