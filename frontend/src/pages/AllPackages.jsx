import React, { useState, useMemo } from "react";
import { useAllPackages } from "../hooks/usePackages";
import { useNavigate } from "react-router-dom";

const AllPackages = () => {
  const { data, isLoading, isError } = useAllPackages();
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [durationRange, setDurationRange] = useState([1, 30]);
  const [showFilters, setShowFilters] = useState(false);

  // Transform API data for frontend using only actual backend fields
  const allPackages = useMemo(() => {
    return Array.isArray(data?.data) && data.data.length
      ? data.data.map((pkg, index) => ({
          id: pkg._id || index + 1,
          title: pkg.name || `Package ${index + 1}`,
          duration: pkg.durationDays
            ? `${pkg.durationDays - 1}N/${pkg.durationDays}D`
            : "N/A",
          durationDays: pkg.durationDays || 0,
          description: pkg.description || "Adventure awaits!",
          image:
            pkg.image ||
            pkg.images ||
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=300&fit=crop",
          price: pkg.basePrice || 0,
          location: pkg.country || "Multiple destinations",
          tag: pkg.isRecommended ? "RECOMMENDED" : "TOUR",
          bestSeason: pkg.bestSeason || "all",
          slug: pkg.slug || "",
        }))
      : [];
  }, [data]);

  // Get min/max values for sliders
  const priceStats = useMemo(() => {
    const prices = allPackages.map((pkg) =>
      typeof pkg.price === "number" ? pkg.price : 0
    );
    return {
      min: Math.min(...prices) || 0,
      max: Math.max(...prices) || 1000000,
    };
  }, [allPackages]);

  const durationStats = useMemo(() => {
    const durations = allPackages.map((pkg) => pkg.durationDays || 0);
    return {
      min: Math.min(...durations) || 1,
      max: Math.max(...durations) || 30,
    };
  }, [allPackages]);

  // Filter packages based on price and duration
  const packages = useMemo(() => {
    return allPackages.filter((pkg) => {
      const price = typeof pkg.price === "number" ? pkg.price : 0;
      const duration = pkg.durationDays || 0;

      return (
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        duration >= durationRange[0] &&
        duration <= durationRange[1]
      );
    });
  }, [allPackages, priceRange, durationRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading packages...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400">
            Failed to load packages. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                All Travel Packages
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Discover amazing destinations with our curated travel packages
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Sort & Filter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-80 flex-shrink-0`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Sort & Filter
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="range-slider-container">
                    <input
                      type="range"
                      min={priceStats.min}
                      max={priceStats.max}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin <= priceRange[1]) {
                          setPriceRange([newMin, priceRange[1]]);
                        }
                      }}
                      className="w-full slider"
                    />
                    <input
                      type="range"
                      min={priceStats.min}
                      max={priceStats.max}
                      value={priceRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax >= priceRange[0]) {
                          setPriceRange([priceRange[0], newMax]);
                        }
                      }}
                      className="absolute top-0 w-full slider"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Duration (Days)
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Min. {durationRange[0]} days</span>
                    <span>Max. {durationRange[1]} days</span>
                  </div>
                  <div className="range-slider-container">
                    <input
                      type="range"
                      min={durationStats.min}
                      max={durationStats.max}
                      value={durationRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin <= durationRange[1]) {
                          setDurationRange([newMin, durationRange[1]]);
                        }
                      }}
                      className="w-full slider"
                    />
                    <input
                      type="range"
                      min={durationStats.min}
                      max={durationStats.max}
                      value={durationRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax >= durationRange[0]) {
                          setDurationRange([durationRange[0], newMax]);
                        }
                      }}
                      className="absolute top-0 w-full slider"
                    />
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {packages.length}
                  </span>{" "}
                  of {allPackages.length} packages
                </p>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setPriceRange([priceStats.min, priceStats.max]);
                  setDurationRange([durationStats.min, durationStats.max]);
                }}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="flex-1">
            {packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Image with Tag */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                        {pkg.tag}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {pkg.title}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">
                          {pkg.duration}
                        </span>
                        <span className="text-sm text-gray-500">
                          {pkg.location}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {pkg.description}
                      </p>

                      {/* Best Season */}
                      <div className="mb-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Best: {pkg.bestSeason}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">
                          All inclusive tour price starts
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹
                          {typeof pkg.price === "number"
                            ? pkg.price.toLocaleString()
                            : pkg.price}
                        </p>
                      </div>

                      {/* More Info Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/packages/${pkg.slug}`);
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                        More Info
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-400 text-6xl mb-4">✈️</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No packages available
                </h3>
                <p className="text-gray-500">
                  Check back later for new travel packages!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card modal removed: Only More Info button navigates */}
    </div>
  );
};

export default AllPackages;