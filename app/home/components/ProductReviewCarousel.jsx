"use client";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Cookies from "js-cookie";
import { Star, User } from "lucide-react";

import Loading from "../../../components/Loading";

const ProductReviewCarousel = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const token = Cookies.get("auth_token");

  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);

  const isFetching = useRef(false);
  const swiperRef = useRef(null);

  // ✅ Fetch reviews with pagination
  const fetchReviews = async (pageNumber = 1) => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      if (pageNumber === 1) setLoading(true);
      setError("");

      const response = await fetch(
        `${apiUrl}/api/v1/product-review?page=${pageNumber}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log("Fetched data:", data);

      // ✅ Handle both possible response structures
      const responseData = data.data || data;
      const newReviews = responseData.reviews || [];
      const newPagination = responseData.pagination || {};

      if (data.status && newReviews.length) {
        setReviews((prev) =>
          pageNumber === 1 ? newReviews : [...prev, ...newReviews]
        );
        setPagination(newPagination);
        setCurrentPage(pageNumber);
      } else if (pageNumber === 1) {
        setReviews([]);
        setError(data.message || "No reviews found");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to fetch reviews. Please try again later.");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // ✅ Trigger next page fetch on slide change
  const handleSlideChange = (swiper) => {
    const index = swiper.activeIndex;
    const slidesPerView = swiper.params.slidesPerView || 1;

    const totalSlides = reviews.length;
    const isNearEnd = index >= totalSlides - slidesPerView - 1;

    // ✅ Auto-fetch next page when reaching end
    if (isNearEnd && pagination?.hasNextPage && !isFetching.current) {
      console.log("Fetching next page via swipe...");
      fetchReviews(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, []);

  if (loading && reviews.length === 0) return <Loading />;

  if (error && reviews.length === 0)
    return (
      <div
        className="text-center py-10 text-lg"
        style={{ color: "var(--color-danger)", fontFamily: "var(--font-body)" }}
      >
        {error}
      </div>
    );

  return (
    <div className="p-2 relative slider-out-pagination">
      <h3
        className="text-2xl font-bold py-3 text-left"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        Customer Review
      </h3>

      <Swiper
        ref={swiperRef}
        modules={[Pagination]}
        spaceBetween={15}
        slidesPerView={4}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        onSlideChange={handleSlideChange}
        className="py-4 !pb-8"
      >
        {reviews.map((review, index) => (
          <SwiperSlide
            key={`${review.review_id || index}`}
            className="flex flex-col !h-auto"
          >
            <div
              className="p-6 rounded-xl h-full flex flex-col"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              {/* User Info & Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "var(--color-bg-alt)" }}
                  >
                    <User
                      size={20}
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                  </div>
                  {/* If we had a user name, it would go here. For now, maybe just "Customer" or hide it */}
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "fill-current" : ""}
                      style={{
                        color:
                          i < review.rating
                            ? "var(--color-secondary)"
                            : "var(--color-border)",
                        strokeWidth: i < review.rating ? 0 : 2,
                      }}
                    />
                  ))}
                </div>
              </div>

              <h3
                className="text-lg font-semibold mb-2 line-clamp-1"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {review.review_title}
              </h3>

              <p
                className="text-sm leading-relaxed flex-grow overflow-hidden"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {review.review_text && review.review_text.length > 150
                  ? `${review.review_text.substring(0, 150)}...`
                  : review.review_text}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductReviewCarousel;
