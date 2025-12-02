"use client";
import ProductViewer from "./ProductsViwer";
import CategoryViewer from "./CategoryViwer";
import QRCodeScanner from "../../../components/QRCodeScanner";
import AdvertiseSlider from "./AdvertiseSlider";
import ProductReviewCarousel from "./ProductReviewCarousel";
import HeroSection from "./HeroSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <CategoryViewer />
      <ProductViewer />
      <AdvertiseSlider />
      <ProductReviewCarousel />
      <QRCodeScanner />
    </div>
  );
};

export default Home;
