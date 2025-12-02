"use client";
import React, { useEffect, useState, useRef } from "react";
import { useStore } from "../../../stores/useStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ShoppingCart, Play, Image, Clock } from "lucide-react";

const AdvertiseSlider = () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_SERVER_API_URL || "https://imd.imdbazer.shop";
  console.log("NEXT_PUBLIC_SERVER_API_URL", apiUrl);
  const { products } = useStore();
  const [AdvertisedProducts, setAdvertisedProducts] = useState([]);
  const swiperRef = useRef(null);
  const videoRefs = useRef({});
  const autoplayTimeoutRef = useRef(null);

  useEffect(() => {
    if (products && products.length > 0) {
      const sliderItems = products.filter((p) => p.is_advertised === true);
      setAdvertisedProducts(sliderItems);
    }
  }, [products]);

  // Handle video ended event
  const handleVideoEnd = (productId) => {
    if (swiperRef.current && swiperRef.current.slideNext) {
      swiperRef.current.slideNext();
    }
  };

  // Handle slide change - pause all videos and play current slide's video
  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex;

    // Clear any existing autoplay timeout
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }

    // Pause all videos first
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Play the current slide's video if it exists
    setTimeout(() => {
      const currentProduct = AdvertisedProducts[realIndex];
      if (currentProduct && currentProduct.video?.[0]) {
        const currentVideo = videoRefs.current[currentProduct.product_id];
        if (currentVideo) {
          const playPromise = currentVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              if (error.name !== "AbortError") {
                console.error("Video play error:", error);
              }
            });
          }
        }
      }
    }, 300);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <section className="m-1 flex justify-center items-center">
      <div
        className="w-full slider-out-pagination"
        style={{ minHeight: "250px" }}
      >
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={5}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          onSlideChange={handleSlideChange}
        >
          {AdvertisedProducts.map((product, index) => (
            <SwiperSlide
              key={product.product_id}
              className="p-1 border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div
                className="relative overflow-hidden group w-full transition-all duration-500"
                style={{ aspectRatio: "2.5/1", minHeight: "200px" }}
              >
                {/* Video or Image */}
                {product.video?.[0] ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => {
                        videoRefs.current[product.product_id] = el;
                      }}
                      className="w-full h-full object-cover"
                      muted
                      loop={false}
                      playsInline
                      preload="metadata"
                      onEnded={() => handleVideoEnd(product.product_id)}
                    >
                      <source
                        src={`${apiUrl}/image/product/${product.video[0]}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>

                    {/* Video Playback Controls Overlay */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black bg-opacity-50 text-white text-sm">
                      <Clock size={16} />
                      <span>Video Ad</span>
                    </div>
                  </div>
                ) : product.banner_image?.[0] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`${apiUrl}/image/product/${product.banner_image[0]}`}
                      alt={product.name}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />

                    {/* Image Slide Indicator */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black bg-opacity-50 text-white text-sm">
                      <Image size={16} />
                      <span>Image Ad</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-bg-alt)" }}
                  >
                    <Image
                      className="h-12 w-12"
                      style={{ color: "var(--color-text-muted)" }}
                    />
                  </div>
                )}

                {/* Product Information Overlay */}
                <div
                  className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3), transparent)",
                  }}
                >
                  {/* Content Container */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="max-w-2xl">
                      {/* Product Name */}
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                        {product.name}
                      </h3>

                      {/* Product Description */}
                      {product.description && (
                        <p className="text-lg mb-3 drop-shadow-md opacity-90 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {product.price && (
                            <div className="text-xl font-semibold drop-shadow-md">
                              {formatPrice(product.price)}
                            </div>
                          )}

                          {/* Product Features/Badges */}
                          {product.features && product.features.length > 0 && (
                            <div className="hidden md:flex items-center gap-2">
                              {product.features
                                .slice(0, 2)
                                .map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Call to Action Button */}
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg">
                          <ShoppingCart size={20} />
                          Shop Now
                        </button>
                      </div>

                      {/* Additional Info */}
                      {(product.category || product.brand) && (
                        <div className="mt-3 flex items-center gap-4 text-sm opacity-80">
                          {product.category && (
                            <span>Category: {product.category}</span>
                          )}
                          {product.brand && <span>Brand: {product.brand}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gradient overlay for better text readability */}
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AdvertiseSlider;
