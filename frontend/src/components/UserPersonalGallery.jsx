import React, { useState } from "react";
import {
  useUserGalleryImages,
  useDeleteUserGalleryImage,
} from "../hooks/useImgUpload";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const UserPersonalGallery = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: galleryData, isLoading, isError } = useUserGalleryImages();
  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteUserGalleryImage();

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  let galleryImages = [];

  if (Array.isArray(galleryData)) {
    galleryImages = galleryData;
  } else if (Array.isArray(galleryData?.data)) {
    galleryImages = galleryData.data;
  } else if (Array.isArray(galleryData?.data?.data)) {
    galleryImages = galleryData.data.data;
  }

  const handleDeleteImage = (id) => {
    deleteImage(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-gallery-images"] });
        setDeleteConfirm(null);
      },
      onError: () => {
        setDeleteConfirm(null);
      },
    });
  };

  const confirmDelete = (id) => setDeleteConfirm(id);
  const cancelDelete = () => setDeleteConfirm(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">Loading your gallery...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">Error loading gallery.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {galleryImages.length > 0
              ? `You have ${galleryImages.length} photo${
                  galleryImages.length > 1 ? "s" : ""
                } in your gallery`
              : "Your uploaded tour photos will appear here"}
          </p>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Delete Image?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteImage(deleteConfirm)}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((image) => {
              const date = new Date(image.uploadedAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              return (
                <div
                  key={image._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt="Gallery"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "";
                        e.target.style.display = "none";
                      }}
                    />

                    {/* Hover Overlay */}
                    <button
                      onClick={() => confirmDelete(image._id)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-4">
                    {image.caption && (
                      <p className="font-medium mb-2 line-clamp-2 text-gray-900 dark:text-white">
                        {image.caption}
                      </p>
                    )}

                    {image.location && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        📍 {image.location}
                      </p>
                    )}

                    {image.tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {image.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                      📅 {date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 md:p-16 text-center max-w-lg mx-auto w-full border border-gray-100 dark:border-gray-700">
              {/* Animated Icon Container */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  {/* Outer Glow Circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>

                  {/* Main Icon Circle */}
                  <div className="relative inline-flex items-center justify-center w-36 h-36 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-full border-4 border-blue-100 dark:border-blue-900/30 shadow-inner">
                    <svg
                      className="w-20 h-20 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Decorative Dots */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                No Photos Yet
              </h2>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto leading-relaxed">
                You haven't uploaded any photos yet. Share your travel memories
                and make your gallery beautiful!
              </p>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/profile?tab=post")}
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                style={{ color: "white" }}
              >
                {/* Button Shine Effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:translate-x-full transition-all duration-700 z-10"></span>

                <svg
                  className="w-6 h-6 relative z-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "white" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="relative z-30" style={{ color: "white" }}>
                  Upload Photo
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPersonalGallery;
