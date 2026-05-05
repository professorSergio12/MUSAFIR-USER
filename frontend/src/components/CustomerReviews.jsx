import React, { useState, useEffect } from "react";
import { getPackageReviews } from "../api/reviewsApi";
import { useQuery } from "@tanstack/react-query";

const CustomerReviews = ({ packageId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["package-reviews", packageId],
    queryFn: () => getPackageReviews(packageId),
    enabled: Boolean(packageId),
  });

  const reviews = reviewsData?.data?.reviews || [];

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading reviews...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Customer Reviews
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No reviews yet. Be the first to review!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
            Customer Reviews
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
            What Our Travelers Say
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {reviews.map((review) => (
              <div key={review._id} className="w-full flex-shrink-0 px-2 sm:px-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    {/* Stars */}
                    <div className="flex justify-center mb-3 md:mb-4">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Title */}
                    {review.title && (
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
                        {review.title}
                      </h3>
                    )}

                    {/* Review Text */}
                    <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 italic mb-4 md:mb-6 leading-relaxed">
                      "{review.review}"
                    </blockquote>

                    {/* Customer Info */}
                    <div className="flex items-center justify-center">
                      <img
                        src={
                          review.user?.avatar ||
                          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
                        }
                        alt={review.user?.name || "User"}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div className="text-left">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {review.user?.name || "Anonymous"}
                        </h4>
                        {review.package?.name && (
                          <p className="text-sm text-orange-500 font-medium">
                            {review.package.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {reviews.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-orange-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
