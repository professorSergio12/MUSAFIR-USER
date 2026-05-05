import React from "react";
import HeroCarousel from "../components/HeroCarousel";
import RecommendedPackages from "../components/RecommendedPackages";
import Services from "../components/Services";
import CustomerReviews from "../components/CustomerReviews";

const Home = () => {
  return (
    <div className="w-full">
      <HeroCarousel />
      <RecommendedPackages />
      <Services />
      <CustomerReviews />
    </div>
  );
};

export default Home;
