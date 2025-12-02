import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ShareButton from "./ShareButton";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ProductImages = ({ product, apiUrl }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  return (
    <div className="space-y-4">
      {/* Main Image Splide */}
      <div
        className="relative group overflow-hidden rounded-xl shadow-sm border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <Swiper
          modules={[FreeMode, Navigation, Thumbs]}
          spaceBetween={0}
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper }}
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
          navigation={true}
          className="aspect-square rounded-lg"
        >
          {product.images?.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-full aspect-square flex items-center justify-center p-4"
                style={{
                  background:
                    "linear-gradient(to bottom right, var(--color-bg), var(--color-bg-alt))",
                }}
              >
                <img
                  src={`${apiUrl}/image/product/${img}`}
                  alt={`${product.title} - Image ${idx + 1}`}
                  className="w-full h-full aspect-square object-contain transition-all duration-500 hover:scale-105"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  loading="eager"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Image Counter */}
        {product.images?.length > 1 && (
          <div
            className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "var(--color-surface)",
            }}
          >
            {activeImageIndex + 1} / {product.images.length}
          </div>
        )}

        {/* Share Button */}
        <div className="absolute top-3 right-3 z-10">
          <ShareButton product={product} />
        </div>
      </div>

      {/* Thumbnail Swiper */}
      {product.images?.length > 1 && (
        <div className="px-2">
          <Swiper
            modules={[FreeMode, Navigation, Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            breakpoints={{
              640: { slidesPerView: 4, spaceBetween: 8 },
            }}
            className="w-full"
          >
            {product.images?.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className={`m-1 aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200`}
                  style={{
                    outline:
                      activeImageIndex === idx
                        ? "2px solid var(--color-text-primary)"
                        : "1px solid var(--color-border)",
                    outlineOffset: activeImageIndex === idx ? "2px" : "0",
                    opacity: activeImageIndex === idx ? 1 : 0.8,
                  }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center p-1"
                    style={{ backgroundColor: "var(--color-bg)" }}
                  >
                    <img
                      src={`${apiUrl}/image/product/${img}`}
                      alt={`${product.title} - Thumbnail ${idx + 1}`}
                      className="w-full h-full aspect-square object-cover rounded transition-transform duration-200 hover:scale-110"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
