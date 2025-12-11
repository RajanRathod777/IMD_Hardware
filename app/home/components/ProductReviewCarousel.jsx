"use client";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Cookies from "js-cookie";

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
    <div className="m-1 relative slider-out-pagination">
      <h3
        className="text-3xl font-bold py-3 text-left"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        Review
      </h3>

      <Swiper
        ref={swiperRef}
        modules={[Pagination, Navigation]}
        spaceBetween={5}
        slidesPerView={4}
        pagination={{ clickable: true }}
        navigation={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        onSlideChange={handleSlideChange}
      >
        {reviews.map((review, index) => (
          <SwiperSlide
            key={`${review.review_id || index}`}
            className="border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="p-5"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div style={{ color: "var(--color-primary)" }}>
                  {"★".repeat(review.rating)}
                  <span style={{ color: "var(--color-border)" }}>
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
              <h3
                className="h-15 text-lg font-semibold mb-1 line-clamp-2"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {review.review_title}
              </h3>
              <p
                className="h-30 text-sm italic overflow-hidden"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {review.review_text && review.review_text.length > 230
                  ? `${review.review_text.substring(0, 230)}...`
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
