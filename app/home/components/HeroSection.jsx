"use client";
import { useState, useEffect } from "react";
import { useStore } from "../../../stores/useStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

const HeroSection = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const { products } = useStore();
  const [sliderProducts, setSliderProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const sliderItems = products.filter((p) => p.is_in_slider === true);
      console.log("home herosection product ", sliderItems);

      setSliderProducts(sliderItems);
    }
  }, [products]);

  return (
    <section className="m-1 flex justify-center items-center">
      <div className="w-full slider-out-pagination">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={5}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          loop={true}
        >
          {sliderProducts.map((product) => (
            <SwiperSlide
              key={product.product_id}
              className="p-1 border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <Link href={`/product/${product.product_id}`}>
                <div
                  className="relative overflow-hidden group w-full"
                  style={{ aspectRatio: "2.5/1", minHeight: "200px" }}
                >
                  {product.banner_image?.[0] && (
                    <img
                      src={`${apiUrl}/image/product/${product.banner_image[0]}`}
                      alt={product.name}
                      loading="eager"
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSection;
