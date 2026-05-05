import React, { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import {
  XMarkIcon,
  MagnifyingGlassPlusIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { getAllGalleryImages } from "../api/imageUploadApi";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getAllGalleryImages();
        const list = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];
        setGalleryImages(list);
      } catch (err) {
        setError(err?.message || "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Normalize DB image to { id, url, title, location } for display
  const toDisplayImage = (img) => ({
    id: img._id,
    url: img.imageUrl,
    title: img.caption || "Gallery",
    location: img.location || "",
  });

  const getHeightClass = (index) => {
    const heights = ["row-span-1", "row-span-2", "row-span-1", "row-span-1"];
    return heights[index % heights.length];
  };

  const getImageHeight = (index) => {
    const classes = ["h-48 sm:h-56 md:h-64", "h-64 sm:h-80 md:h-96", "h-48 sm:h-56 md:h-64", "h-40 sm:h-44 md:h-48"];
    return classes[index % classes.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 md:mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">
          Our Travel Gallery
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 px-2">
          Explore breathtaking destinations around the world
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto">
        {galleryImages.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No images in the gallery yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-max">
            {galleryImages.map((image, index) => {
              const display = toDisplayImage(image);
              return (
                <div
                  key={display.id}
                  className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 ${getHeightClass(index)}`}
                  onClick={() => setSelectedImage(display)}
                >
                  <div
                    className={`relative ${getImageHeight(index)} overflow-hidden`}
                  >
                    <img
                      src={display.url}
                      alt={display.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-base sm:text-lg font-bold mb-1">{display.title}</h3>

                        <p className="text-xs sm:text-sm text-gray-200 flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{display.location}</span>
                        </p>
                      </div>

                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <MagnifyingGlassPlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal - Flowbite */}
      <Modal
        show={selectedImage !== null}
        size="5xl"
        onClose={() => setSelectedImage(null)}
        popup
      >
        {selectedImage && (
          <div className="relative bg-black p-2 sm:p-4 rounded-lg">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white hover:text-gray-300 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full max-h-[70vh] sm:max-h-[80vh] mx-auto object-contain rounded-lg"
            />

            {/* Details */}
            <div className="text-center text-white mt-3 sm:mt-4 px-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{selectedImage.title}</h2>

              <p className="flex justify-center items-center gap-2 mt-1 sm:mt-2 text-sm sm:text-base text-gray-300">
                <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{selectedImage.location}</span>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Gallery;
