import React, { useEffect, useState } from "react";

const services = [
  {
    title: "Affordable Hotels",
    description: "Comfortable stays at the best prices.",
  },
  {
    title: "Food & Drinks",
    description: "Taste the best cuisines from around the world.",
  },
  {
    title: "24x7 Support",
    description: "Always here to help you with your journey.",
  },
  {
    title: "Custom Itineraries",
    description: "Plans personalized just for you.",
  },
  {
    title: "Local Guides",
    description: "Discover hidden gems with local experts.",
  },
  {
    title: "Secure Payments",
    description: "Safe and easy payments every time.",
  },
];

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  // Create extended array for seamless looping
  const extendedServices = [...services, ...services.slice(0, 3)];

  // Detect screen size to determine cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const newCardsPerView = mobile ? 1 : 4;
      setCardsPerView(newCardsPerView);
      
      // Reset index if it becomes invalid after resize
      const maxIndex = services.length - newCardsPerView;
      setCurrentIndex((prev) => Math.min(prev, maxIndex));
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        const maxIndex = services.length - cardsPerView;

        // If we're at the end, jump back to start
        if (nextIndex > maxIndex) {
          setIsTransitioning(false);
          setTimeout(() => {
            setCurrentIndex(0);
            setIsTransitioning(true);
          }, 50);
          return nextIndex;
        }

        setIsTransitioning(true);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [cardsPerView]);

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white-900">Our Services</h2>
          <p className="text-lg text-white-600 mt-2">What We Offer</p>
        </div>

        <div className="relative overflow-hidden w-full">
          <div
            className={`flex ${
              isTransitioning
                ? "transition-transform duration-500 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {extendedServices.map((srv, index) => (
              <div
                key={`${srv.title}-${index}`}
                className="shrink-0 px-2 md:px-3"
                style={{
                  width: isMobile ? '100%' : `calc(100% / ${cardsPerView})`,
                  flexBasis: isMobile ? '100%' : `calc(100% / ${cardsPerView})`,
                }}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-4 text-center h-full max-w-xs mx-auto md:max-w-none">
                  <div className="mb-4 md:mb-3">
                    <div className="w-12 h-12 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-2">
                      <svg
                        className="w-6 h-6 md:w-5 md:h-5 text-orange-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-sm font-bold text-gray-900 mb-2 md:mb-1.5">
                      {srv.title}
                    </h3>
                    <p className="text-xs md:text-xs text-gray-600 leading-relaxed mb-3 md:mb-2">
                      {srv.description}
                    </p>
                  </div>
                  <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold px-4 py-2 md:px-3 md:py-1.5 md:text-xs rounded-lg transition-colors duration-300 w-full">
                    More Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;