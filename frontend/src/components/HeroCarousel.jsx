import React, { useState, useEffect, useRef } from "react";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);

  const videos = [
    "https://res.cloudinary.com/dpu6rveug/video/upload/v1759597912/vid-1_brcvva.mp4",
    "https://res.cloudinary.com/dpu6rveug/video/upload/v1759597912/vid-2_toi6sm.mp4",
    "https://res.cloudinary.com/dpu6rveug/video/upload/v1759597921/vid-3_ufopzd.mp4",
    "https://res.cloudinary.com/dpu6rveug/video/upload/v1759597929/vid-4_pns6kz.mp4",
    "https://res.cloudinary.com/dpu6rveug/video/upload/v1759597906/vid-5_mlvqi7.mp4",
  ];

  // Go to next or previous video
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % videos.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + videos.length) % videos.length);

  // Play only the current video
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentSlide) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentSlide]);

  // Auto-play timer - change slide every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % videos.length);
    }, 10000); // 10 seconds

    return () => clearInterval(timer);
  }, [videos.length]);

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] lg:h-[95vh] overflow-hidden bg-black">
      {/* Videos */}
      {videos.map((src, index) => (
        <video
          key={index}
          ref={(el) => (videoRefs.current[index] = el)}
          src={src}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
          playsInline
        ></video>
      ))}

      {/* Overlay text */}
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase">
          Adventure is Worthwhile
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-2 md:mt-3 font-light">
          Discover New Places With Us — Adventure Awaits
        </p>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 bg-black/50 cursor-pointer hover:bg-black/70 text-white p-2 sm:p-2.5 md:p-3 rounded-full text-sm sm:text-base md:text-lg"
        aria-label="Previous slide"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 cursor-pointer md:right-5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-2.5 md:p-3 rounded-full text-sm sm:text-base md:text-lg"
        aria-label="Next slide"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 cursor-pointer md:h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-orange-500 scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
