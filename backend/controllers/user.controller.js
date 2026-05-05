import User from "../models/auth.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import getDataURI from "../middlewares/dataURI.middleware.js";
import cloudinary from "../config/cloudinary.config.js";

export const updateUserName = async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return next(errorHandler(400, "Name is required"));
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    );

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "Name updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const profilePictureUpload = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return next(errorHandler(400, "No file received"));
    }

    const fileUri = getDataURI(file);

    const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
      folder: "profile-pictures",
    });

    const newImageUrl = uploadResult.secure_url;
    const newPublicId = uploadResult.public_id;

    const user = await User.findById(req.user.id);
    if (!user) {
      await cloudinary.uploader.destroy(newPublicId);
      return next(errorHandler(404, "User not found"));
    }

    if (user.profilePictureId) {
      try {
        await cloudinary.uploader.destroy(user.profilePictureId);
      } catch (err) {
        console.log("Cloudinary delete failed (not critical): ", err.message);
      }
    }

    user.profilePicture = newImageUrl;
    user.profilePictureId = newPublicId;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: user,
    });
  } catch (error) {
    if (error.http_code) {
      return next(
        errorHandler(
          error.http_code,
          `Cloudinary error: ${error.message || "Upload failed"}`
        )
      );
    }
    return next(
      errorHandler(500, "Something went wrong while updating profile picture")
    );
  }
};
