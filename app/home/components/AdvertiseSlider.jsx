"use client";
import React, { useEffect, useState, useRef } from "react";
import { useStore } from "../../../stores/useStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
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

  return (
    <section className="flex justify-center items-center">
      <div
        className="w-full p-2 slider-out-pagination"
        style={{ minHeight: "250px" }}
      >
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Autoplay, Pagination]}
          spaceBetween={5}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ disableOnInteraction: false }}
          loop={true}
          onSlideChange={handleSlideChange}
        >
          {AdvertisedProducts.map((product, index) => (
            <SwiperSlide key={product.product_id}>
              <div
                className="relative rounded-lg overflow-hidden group w-full transition-all duration-500 py-4 !pb-8"
                style={{ aspectRatio: "2.5/1", minHeight: "200px" }}
              >
                {/* Video or Image */}
                {product.video?.[0] ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => {
                        videoRefs.current[product.product_id] = el;
                      }}
                      className="rounded-lg  w-full h-full object-cover"
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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AdvertiseSlider;
