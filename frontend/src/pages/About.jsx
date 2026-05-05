import React from "react";
import {
  UserGroupIcon,
  TrophyIcon,
  GlobeAltIcon,
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const About = () => {
  const stats = [
    { number: "10K+", label: "Happy Travelers" },
    { number: "50+", label: "Destinations" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "Passion for Travel",
      description:
        "We live and breathe travel, creating unforgettable experiences that inspire wanderlust in every journey.",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Trust & Safety",
      description:
        "Your safety is our priority. We ensure secure bookings and 24/7 support throughout your adventure.",
    },
    {
      icon: <StarIcon className="w-8 h-8" />,
      title: "Excellence",
      description:
        "We strive for perfection in every detail, delivering exceptional service that exceeds expectations.",
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Global Network",
      description:
        "With partners worldwide, we bring you authentic experiences and insider access to hidden gems.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="relative text-white py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dpu6rveug/image/upload/v1764841401/about-page_hcuwkl.jpg"
            alt="Travel Background"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-indigo-700/40"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">About Musafir</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto px-2">
            Where Every Journey Becomes a Story Worth Telling
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 dark:from-gray-900 to-transparent z-10"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-12 md:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 text-center hover:scale-105 transition"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-gray-800 py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4 text-gray-900 dark:text-white">
              Our Values
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              The principles that guide our journeys
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-700 rounded-xl p-4 sm:p-6 shadow hover:shadow-xl transition"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dpu6rveug/image/upload/v1764841806/about-page1_l97vhu.jpg"
            alt="Why Choose Us Background"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gray-900/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">Why Choose Musafir?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12">
            <div className="px-2">
              <ClockIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold">24/7 Support</h3>
              <p className="text-sm sm:text-base text-gray-300">Assistance whenever you need it</p>
            </div>

            <div className="px-2">
              <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold">Best Price</h3>
              <p className="text-sm sm:text-base text-gray-300">Guaranteed value for money</p>
            </div>

            <div className="px-2 sm:col-span-2 md:col-span-1">
              <UserGroupIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold">Expert Team</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Travel professionals you can trust
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
