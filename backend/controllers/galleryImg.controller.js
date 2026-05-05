import GalleryImage from "../models/gallery.model.js";
import getDataURI from "../middlewares/dataURI.middleware.js";
import cloudinary from "../config/cloudinary.config.js";

// Public: get all gallery images (for Musafir public gallery page)
export const getAllGalleryImages = async (req, res, next) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserGalleryImages = async (req, res, next) => {
  try {
    const galleryImages = await GalleryImage.find({ userId: req.user.id })
      .sort({ uploadedAt: -1 });
    
    res.status(200).json({
      success: true,
      data: galleryImages,
    });
  } catch (error) {
    next(error);
  }
};

export const GalleryImageController = async (req, res, next) => {
  try {
    const { caption, location, tags } = req.body;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file received" });
    }

    // Convert file buffer → DataURI
    const fileUri = getDataURI(file);

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      fileUri.content,
      {
        folder: "gallery",
      }
    );

    // Save in MongoDB
    const newImage = new GalleryImage({
      userId: req.user.id,
      imageUrl: cloudinaryResponse.secure_url,
      caption,
      location,
      tags: JSON.parse(tags || "[]"), // if coming as a string from frontend
    });

    await newImage.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find the image first to check ownership
    const galleryImage = await GalleryImage.findById(id);
    
    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Verify that the image belongs to the current user
    if (galleryImage.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this image",
      });
    }

    // Delete from Cloudinary
    try {
      const publicId = galleryImage.imageUrl
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, "");
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Cloudinary delete failed:", err);
    }

    // Delete from database
    await GalleryImage.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};