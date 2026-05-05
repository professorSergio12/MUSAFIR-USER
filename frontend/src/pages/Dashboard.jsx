import React, { useState } from "react";
import { useUserBookings } from "../hooks/useBookings";
import { useNavigate } from "react-router-dom";
import { getPackageBySlug } from "../api/packagesApi";
import ReviewForm from "../components/ReviewForm";
import { useQuery } from "@tanstack/react-query";

function Dashboard() {
  const { data: bookingsData, isLoading, isError } = useUserBookings();
  const navigate = useNavigate();
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [fullPackageDetails, setFullPackageDetails] = useState({});
  const [loadingFullDetails, setLoadingFullDetails] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(null);

  const bookings = bookingsData?.data || [];

  const handleViewMore = async (booking) => {
    const slug = booking.packageId.slug;
    const bookingId = booking._id;

    // If already expanded, close it
    if (expandedBookingId === bookingId) {
      setExpandedBookingId(null);
      return;
    }

    // If already loaded, just expand
    if (fullPackageDetails[bookingId]) {
      setExpandedBookingId(bookingId);
      return;
    }

    // Fetch full package details
    setLoadingFullDetails((prev) => ({ ...prev, [bookingId]: true }));
    try {
      const fullPackage = await getPackageBySlug(slug);
      setFullPackageDetails((prev) => ({
        ...prev,
        [bookingId]: fullPackage,
      }));
      setExpandedBookingId(bookingId);
    } catch (error) {
      console.error("Error fetching full package:", error);
      alert("Failed to load package details. Please try again.");
    } finally {
      setLoadingFullDetails((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleAddReview = (booking) => {
    // Handle both populated and non-populated packageId
    const packageId = booking.packageId?._id
      ? booking.packageId._id.toString()
      : booking.packageId?.toString() || booking.packageId;

    setShowReviewForm({
      packageId: packageId,
      bookingId: booking._id,
      packageName:
        booking.packageId?.name || booking.packageId?.name || "Package",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-4">
            Failed to load your bookings. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
            View and manage all your travel bookings
          </p>
        </div>

        {/* Bookings Grid */}
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {bookings.map((booking) => {
              const packageData = booking.packageId;
              const bookingDate = new Date(
                booking.createdAt
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              const isExpanded = expandedBookingId === booking._id;
              const fullPackage = fullPackageDetails[booking._id];
              const isLoadingDetails = loadingFullDetails[booking._id];

              return (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Package Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={
                        packageData?.images ||
                        packageData?.image ||
                        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=300&fit=crop"
                      }
                      alt={packageData?.name || "Package"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <span
                        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${
                          booking.status === "Confirmed"
                            ? "bg-green-500 text-white"
                            : booking.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 md:p-6">
                    {/* Package Name */}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {packageData?.name || "Package Name"}
                    </h3>

                    {/* Package Details */}
                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="truncate">
                          {packageData?.durationDays
                            ? `${packageData.durationDays} Days / ${
                                packageData.durationDays - 1
                              } Nights`
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">
                          {packageData?.country || "Multiple destinations"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate">Booked on {bookingDate}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    {/* Booking Amount */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        Total Amount:
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-red-600">
                        ₹{booking.amount?.toLocaleString() || "0"}
                      </span>
                    </div>

                    {/* Expanded Section - Full Package Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                        {isLoadingDetails ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Loading details...
                            </p>
                          </div>
                        ) : fullPackage ? (
                          <>
                            {/* Full Description */}
                            {fullPackage.description && (
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                  Description
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {fullPackage.description}
                                </p>
                              </div>
                            )}

                            {/* Itinerary */}
                            {fullPackage.itinerary &&
                              fullPackage.itinerary.length > 0 && (
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                    Itinerary
                                  </h4>
                                  <div className="space-y-2">
                                    {fullPackage.itinerary.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
                                      >
                                        <span className="text-red-600 dark:text-red-400 font-bold">
                                          {idx + 1}.
                                        </span>
                                        <span>{item.name || item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {/* Hotels */}
                            {fullPackage.availableHotels &&
                              fullPackage.availableHotels.length > 0 && (
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                    Available Hotels
                                  </h4>
                                  <div className="space-y-2">
                                    {fullPackage.availableHotels.map(
                                      (hotel, idx) => (
                                        <div
                                          key={idx}
                                          className="text-sm text-gray-600 dark:text-gray-300"
                                        >
                                          {hotel.name || hotel}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Food Options */}
                            {fullPackage.availableFoodOptions &&
                              fullPackage.availableFoodOptions.length > 0 && (
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                    Food Options
                                  </h4>
                                  <div className="space-y-2">
                                    {fullPackage.availableFoodOptions.map(
                                      (food, idx) => (
                                        <div
                                          key={idx}
                                          className="text-sm text-gray-600 dark:text-gray-300"
                                        >
                                          {food.name || food}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </>
                        ) : null}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2 mt-3 sm:mt-4">
                      <button
                        onClick={() => handleViewMore(booking)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer text-sm sm:text-base"
                      >
                        {isExpanded ? "View Less" : "View More"}
                      </button>

                      <button
                        onClick={() => handleAddReview(booking)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer text-sm sm:text-base"
                      >
                        Add Review
                      </button>

                      {packageData?.slug && (
                        <button
                          onClick={() =>
                            navigate(`/packages/${packageData.slug}`)
                          }
                          className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer text-sm sm:text-base"
                        >
                          View Package Page
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[70vh] px-4 sm:px-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16 text-center max-w-lg mx-auto w-full border border-gray-100 dark:border-gray-700">
              {/* Animated Icon Container */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  {/* Outer Glow Circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>

                  {/* Main Icon Circle */}
                  <div className="relative inline-flex items-center justify-center w-36 h-36 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-full border-4 border-red-100 dark:border-red-900/30 shadow-inner">
                    <svg
                      className="w-20 h-20 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>

                  {/* Decorative Dots */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                No Bookings Yet
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-md mx-auto leading-relaxed px-2">
                You haven't booked any package yet. Explore our amazing travel
                packages and find your perfect trip!
              </p>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/all-packages")}
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 font-bold py-3 sm:py-4 px-6 sm:px-8 md:px-10 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer text-sm sm:text-base"
                style={{ color: "white" }}
              >
                {/* Button Shine Effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:translate-x-full transition-all duration-700 z-10"></span>

                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 relative z-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "white" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="relative z-30" style={{ color: "white" }}>
                  Explore All Packages
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          packageId={showReviewForm.packageId}
          bookingId={showReviewForm.bookingId}
          packageName={showReviewForm.packageName}
          onClose={() => setShowReviewForm(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
