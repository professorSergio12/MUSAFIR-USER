import React, { useState } from "react";
import { useCreateReview } from "../hooks/useReview";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

const ReviewForm = ({ packageId, bookingId, onClose, packageName }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    review: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSuccess = () => {
    alert("Review submitted successfully!");
    onClose();
  };

  const handleError = (error) => {
    const message =
      error?.response?.data?.message ||
      "Failed to submit review. Please try again.";
    alert(message);
  };

  const { mutate: submitReview, isPending } = useCreateReview(
    handleSuccess,
    handleError
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
    if (errors.rating) {
      setErrors((prev) => ({
        ...prev,
        rating: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.rating || formData.rating < 1) {
      newErrors.rating = "Please select a rating";
    }
    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    if (!formData.review || formData.review.trim().length < 10) {
      newErrors.review = "Review must be at least 10 characters";
    }
    if (formData.review.length > 1000) {
      newErrors.review = "Review must be less than 1000 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const reviewData = {
      package: packageId,
      booking: bookingId || undefined,
      rating: formData.rating,
      title: formData.title.trim(),
      review: formData.review.trim(),
      // images: [] // Add images support later with Cloudinary upload
    };

    submitReview(reviewData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Write a Review
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 dark:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Package Name */}
          {packageName && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Reviewing:
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {packageName}
              </p>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none cursor-pointer"
                >
                  {hoveredRating >= star || formData.rating >= star ? (
                    <StarIcon className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="w-8 h-8 text-gray-300" />
                  )}
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {formData.rating} out of 5
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your review a title"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 characters
            </p>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              placeholder="Share your experience with this package..."
              rows={6}
              maxLength={1000}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.review.length}/1000 characters
            </p>
            {errors.review && (
              <p className="mt-1 text-sm text-red-600">{errors.review}</p>
            )}
          </div>

          {/* Images - Coming Soon */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Optional)
            </label>
            <p className="text-sm text-gray-500 italic">
              Image upload feature coming soon!
            </p>
          </div> */}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
