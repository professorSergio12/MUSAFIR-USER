import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePackageBySlug } from "../hooks/usePackages";
import { useCreateOrder, useVerifyPayment } from "../hooks/usePayment";

const PackageDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.currentUser);
  const { data: packageData, isLoading, error } = usePackageBySlug(slug);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedFoodOption, setSelectedFoodOption] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutate: verifyPayment, isPending: isVerifyingPayment } =
    useVerifyPayment();

  // Calculate total price based on selections
  useEffect(() => {
    if (packageData) {
      let totalPrice = packageData.basePrice || 0;
      const duration = packageData.durationDays || 0;

      // Add hotel cost
      if (selectedHotel && selectedRoomType) {
        const hotelCost =
          (selectedHotel.pricePerNight + selectedRoomType.surcharge) * duration;
        totalPrice += hotelCost;
      }

      // Add food cost
      if (selectedFoodOption) {
        const foodCost = selectedFoodOption.surchargePerDay * duration;
        totalPrice += foodCost;
      }

      setCalculatedPrice(totalPrice);
    }
  }, [packageData, selectedHotel, selectedRoomType, selectedFoodOption]);

  useEffect(() => {
    if (packageData) {
      if (packageData.availableHotels?.length > 0) {
        const defaultHotel = packageData.availableHotels[0];
        setSelectedHotel(defaultHotel);
        if (defaultHotel.roomTypes?.length > 0) {
          setSelectedRoomType(defaultHotel.roomTypes[0]);
        }
      }
      if (packageData.availableFoodOptions?.length > 0) {
        setSelectedFoodOption(packageData.availableFoodOptions[0]);
      }
    }
  }, [packageData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-300">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400">
            {error?.message || "Failed to load package details"}
          </p>
          <button
            onClick={() => navigate("/all-packages")}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-300">Package not found</p>
          <button
            onClick={() => navigate("/all-packages")}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = async () => {
    if (!calculatedPrice || calculatedPrice <= 0) {
      alert("Invalid amount to book this package.");
      return;
    }

    try {
      const orderResponse = await new Promise((resolve, reject) => {
        createOrder(
          { amount: calculatedPrice },
          {
            onSuccess: (data) => resolve(data),
            onError: (err) => reject(err),
          }
        );
      });

      if (!orderResponse?.orderId) {
        alert("Failed to create order. Please try again.");
        return;
      }

      const { orderId, amount, currency } = orderResponse;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency,
        name: "MUSAFAR",
        description: `Booking for ${packageData.name}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await new Promise((resolve, reject) => {
              verifyPayment(
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  packageId: packageData._id,
                  amount: calculatedPrice,
                },
                {
                  onSuccess: (data) => resolve(data),
                  onError: (err) => reject(err),
                }
              );
            });

            if (verifyResponse.success) {
              alert("Payment successful! Booking confirmed.");
              navigate("/booking-success");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Something went wrong during payment verification.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#EF4444",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        alert("Payment failed. Please try again.");
        console.error("Payment failed:", response.error);
      });
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to initiate payment. Please try again later.");
    }
  };
  if (isVerifyingPayment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Processing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 md:mb-4">
            <button
              onClick={() => navigate("/all-packages")}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 p-1 flex-shrink-0"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white break-words">
              {packageData.name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1 sm:gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
              <span className="whitespace-nowrap">{packageData.durationDays} Days / {packageData.durationDays - 1} Nights</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
              <span className="truncate max-w-[150px] sm:max-w-none">{packageData.country}</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <span className="whitespace-nowrap">₹{packageData.basePrice?.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            {/* Package Image */}
            <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[420px] w-full rounded-xl overflow-hidden">
              <img
                src={
                  packageData.images ||
                  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&h=700&fit=crop"
                }
                alt={packageData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                About This Package
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {packageData.description ||
                  "Experience the best of this amazing destination with our carefully curated package."}
              </p>
            </div>

            {/* Itinerary - Places to Visit */}
            {packageData.itinerary && packageData.itinerary.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Places You'll Visit
                </h2>
                <div className="space-y-4">
                  {packageData.itinerary.map((location, index) => (
                    <div
                      key={location._id || index}
                      className="border-l-4 border-red-500 pl-3 sm:pl-4"
                    >
                      <div className="flex items-start gap-2 sm:gap-4">
                        <div className="bg-red-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                          {location.day}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {location.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {location.city}, {location.country}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                            {location.details}
                          </p>
                          {location.locationImage && (
                            <img
                              src={location.locationImage}
                              alt={location.name}
                              className="mt-4 w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg shadow-lg"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Hotels */}
            {packageData.availableHotels &&
              packageData.availableHotels.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    Choose Your Hotel
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {packageData.availableHotels.map((hotel, index) => (
                      <div
                        key={hotel._id || index}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedHotel?._id === hotel._id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedHotel(hotel);
                          if (hotel.roomTypes && hotel.roomTypes.length > 0) {
                            setSelectedRoomType(hotel.roomTypes[0]);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {hotel.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              hotel.tier === "Luxury"
                                ? "bg-purple-100 text-purple-800"
                                : hotel.tier === "Standard"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {hotel.tier}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {hotel.city}, {hotel.country}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {hotel.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-red-600">
                            ₹{hotel.pricePerNight?.toLocaleString()}/night
                          </span>
                          {selectedHotel?._id === hotel._id && (
                            <span className="text-green-600 text-sm font-medium">
                              ✓ Selected
                            </span>
                          )}
                        </div>
                        {hotel.images && hotel.images.length > 0 && (
                          <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="mt-4 w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Room Type Selection */}
                  {selectedHotel &&
                    selectedHotel.roomTypes &&
                    selectedHotel.roomTypes.length > 0 && (
                      <div className="mt-4 sm:mt-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                          Choose Room Type
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {selectedHotel.roomTypes.map((roomType, index) => (
                            <div
                              key={index}
                              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                selectedRoomType?.name === roomType.name
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedRoomType(roomType)}
                            >
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {roomType.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {roomType.surcharge === 0
                                  ? "Base price"
                                  : `+₹${roomType.surcharge.toLocaleString()}/night`}
                              </p>
                              {selectedRoomType?.name === roomType.name && (
                                <span className="text-green-600 text-sm font-medium">
                                  ✓ Selected
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

            {/* Food Options */}
            {packageData.availableFoodOptions &&
              packageData.availableFoodOptions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    Choose Your Meal Plan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {packageData.availableFoodOptions.map((food, index) => (
                      <div
                        key={food._id || index}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedFoodOption?._id === food._id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedFoodOption(food)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {food.name}
                          </h3>
                          <span className="text-lg font-bold text-red-600">
                            {food.surchargePerDay === 0
                              ? "Included"
                              : `+₹${food.surchargePerDay?.toLocaleString()}/day`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {food.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {food.includesBreakfast && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              Breakfast
                            </span>
                          )}
                          {food.includesLunch && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              Lunch
                            </span>
                          )}
                          {food.includesDinner && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              Dinner
                            </span>
                          )}
                        </div>
                        {selectedFoodOption?._id === food._id && (
                          <span className="text-green-600 text-sm font-medium">
                            ✓ Selected
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg lg:sticky lg:top-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                Package Summary
              </h3>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Duration:</span>
                  <span className="text-sm sm:text-base font-semibold">
                    {packageData.durationDays} Days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Best Season:</span>
                  <span className="text-sm sm:text-base font-semibold capitalize">
                    {packageData.bestSeason}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Country:</span>
                  <span className="text-sm sm:text-base font-semibold truncate ml-2">{packageData.country}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Price Breakdown
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Base Package:</span>
                    <span>₹{packageData.basePrice?.toLocaleString()}</span>
                  </div>

                  {selectedHotel && selectedRoomType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Hotel ({selectedHotel.name}):
                      </span>
                      <span>
                        ₹
                        {(
                          (selectedHotel.pricePerNight +
                            selectedRoomType.surcharge) *
                          packageData.durationDays
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedFoodOption && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Meals ({selectedFoodOption.name}):
                      </span>
                      <span>
                        ₹
                        {(
                          selectedFoodOption.surchargePerDay *
                          packageData.durationDays
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between font-bold text-base sm:text-lg">
                      <span>Total Price:</span>
                      <span className="text-red-600">
                        ₹{calculatedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Options */}
              {(selectedHotel || selectedFoodOption) && (
                <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    Selected Options
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {selectedHotel && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Hotel: </span>
                        <span className="font-medium">
                          {selectedHotel.name}
                        </span>
                        {selectedRoomType && (
                          <span className="text-gray-500">
                            {" "}
                            ({selectedRoomType.name})
                          </span>
                        )}
                      </div>
                    )}
                    {selectedFoodOption && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Meals: </span>
                        <span className="font-medium">
                          {selectedFoodOption.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-3 sm:pt-4">
                {user == null ? (
                  <button
                    onClick={() => navigate("/signin", { state: { from: location.pathname } })}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                  >
                    Sign In to Book
                  </button>
                ) : (
                  <button
                    onClick={handleBookNow}
                    disabled={isCreatingOrder}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                  >
                    {isCreatingOrder
                      ? "Processing..."
                      : `Book This Package - ₹${calculatedPrice.toLocaleString()}`}
                  </button>
                )}
                <button
                  onClick={() => navigate("/all-packages")}
                  className="w-full mt-2 sm:mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                >
                  View All Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
