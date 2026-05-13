import React, { useState } from "react";
import { useCreateReview } from "../hooks/useReview";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  StarIcon as StarOutlineIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

/** Review modal — app is dark-only; no light theme branch. */
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
    };

    submitReview(reviewData);
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
  const displayRating = hoveredRating || formData.rating;

  const inputClass =
    "review-modal-scroll w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 shadow-inner " +
    "placeholder:text-slate-400 selection:bg-red-900/80 selection:text-white transition " +
    "focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-900";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 text-slate-100 shadow-2xl ring-1 ring-white/10"
        role="dialog"
        aria-labelledby="review-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-red-800 via-rose-800 to-red-950 px-6 py-5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-black/20" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-black/20">
                <SparklesIcon className="h-6 w-6 text-amber-200" aria-hidden />
              </div>
              <div className="min-w-0">
                <h2
                  id="review-modal-title"
                  className="text-xl font-bold tracking-tight text-white sm:text-2xl"
                >
                  Share your trip
                </h2>
                <p className="mt-0.5 text-sm text-slate-200">
                  Honest reviews help other travellers choose better.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[min(78vh,640px)] flex-col bg-slate-900 text-slate-100"
        >
          <div className="review-modal-scroll max-h-[min(52vh,420px)] space-y-5 overflow-x-auto overflow-y-auto overscroll-contain px-6 py-6">
            {packageName ? (
              <div className="rounded-xl border border-red-500/40 bg-slate-800/80 p-4 ring-1 ring-white/5">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-300/90">
                  Reviewing package
                </p>
                <p className="mt-1.5 text-base font-semibold leading-snug text-white">
                  {packageName}
                </p>
              </div>
            ) : null}

            <div>
              <label
                htmlFor="review-rating"
                className="mb-3 flex items-baseline justify-between text-sm font-semibold text-slate-200"
              >
                <span id="review-rating">
                  Overall rating <span className="text-red-400">*</span>
                </span>
                {displayRating > 0 ? (
                  <span className="text-sm font-medium text-amber-300">
                    {ratingLabels[displayRating]}
                  </span>
                ) : null}
              </label>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="rounded-lg p-1.5 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label={`Rate ${star} out of 5`}
                  >
                    {hoveredRating >= star || formData.rating >= star ? (
                      <StarIcon className="h-9 w-9 text-amber-400 sm:h-10 sm:w-10" />
                    ) : (
                      <StarOutlineIcon className="h-9 w-9 text-slate-500 sm:h-10 sm:w-10" />
                    )}
                  </button>
                ))}
                {formData.rating > 0 ? (
                  <span className="ml-1 text-sm font-medium text-slate-400">
                    {formData.rating} / 5
                  </span>
                ) : null}
              </div>
              {errors.rating ? (
                <p className="mt-2 text-sm font-medium text-red-400">
                  {errors.rating}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="review-title"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Review title <span className="text-red-400">*</span>
              </label>
              <input
                id="review-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Smooth booking, amazing guides"
                maxLength={100}
                className={inputClass}
              />
              <p className="mt-1.5 text-right text-xs font-medium text-slate-400">
                {formData.title.length} / 100
              </p>
              {errors.title ? (
                <p className="mt-1 text-sm font-medium text-red-400">
                  {errors.title}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="review-body"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Your experience <span className="text-red-400">*</span>
              </label>
              <textarea
                id="review-body"
                name="review"
                value={formData.review}
                onChange={handleChange}
                placeholder="What did you love? Anything others should know?"
                rows={5}
                maxLength={1000}
                className={`${inputClass} resize-none break-words leading-relaxed`}
              />
              <p className="mt-1.5 text-right text-xs font-medium text-slate-400">
                {formData.review.length} / 1000
              </p>
              {errors.review ? (
                <p className="mt-1 text-sm font-medium text-red-400">
                  {errors.review}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-700 bg-slate-950 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:w-auto sm:min-w-[120px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:from-red-500 hover:to-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[160px]"
            >
              {isPending ? "Submitting…" : "Submit review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
