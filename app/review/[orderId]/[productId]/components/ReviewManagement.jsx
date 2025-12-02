"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Star,
  ArrowLeft,
  Loader,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";

export default function ReviewManagement() {
  const params = useParams();
  const { orderId, productId } = params;
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const token = Cookies.get("auth_token");

  const [review, setReview] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review_title: "",
    review_text: "",
  });

  useEffect(() => {
    if (orderId && productId) {
      fetchReviewDetails();
    }
  }, [orderId, productId]);

  const fetchReviewDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch product details
      const productResponse = await fetch(
        `${apiUrl}/api/v1/product/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (productResponse.ok) {
        const productData = await productResponse.json();
        if (productData.status) {
          setProduct(productData.product);
        }
      }

      // Fetch existing review
      const reviewResponse = await fetch(
        `${apiUrl}/api/v1/product-review?order_id=${orderId}&product_id=${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (reviewResponse.ok) {
        const reviewData = await reviewResponse.json();
        if (reviewData.status && reviewData.reviews.length > 0) {
          const existingReview = reviewData.reviews[0];
          setReview(existingReview);
          setReviewForm({
            rating: existingReview.rating,
            review_title: existingReview.review_title || "",
            review_text: existingReview.review_text || "",
          });
        } else {
          setReview(null);
          setReviewForm({ rating: 0, review_title: "", review_text: "" });
        }
      }
    } catch (err) {
      setError("Failed to load review details. Please try again.");
      console.error("Error fetching review details:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setValidationError("");
    setError("");
    setSuccessMessage("");

    const title = reviewForm.review_title.trim();
    const text = reviewForm.review_text.trim();

    // Validation
    if (reviewForm.rating === 0) {
      setValidationError("Please select a rating");
      return;
    }
    if (!title) {
      setValidationError("Review title is required");
      return;
    }
    if (!text) {
      setValidationError("Review details are required");
      return;
    }
    try {
      setReviewLoading(true);
      if (review) {
        await updateReview();
      } else {
        await addReview();
      }
    } catch (err) {
      setError("Failed to submit review. Please try again.");
      console.error("Error submitting review:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  const addReview = async () => {
    const response = await fetch(`${apiUrl}/api/v1/product-review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        order_id: orderId,
        rating: reviewForm.rating,
        review_title: reviewForm.review_title.trim(),
        review_text: reviewForm.review_text.trim(),
      }),
    });

    if (!response.ok) new Error("Failed to add review");

    const data = await response.json();
    console.log(data);

    if (data.status) {
      setReview(data.review);
      setSuccessMessage("Review submitted successfully!");
      // Optional: navigate back after 1.5s
      // setTimeout(() => router.back(), 1500);
    }
  };

  const updateReview = async () => {
    const response = await fetch(`${apiUrl}/api/v1/product-review`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        review_id: review.review_id,
        rating: reviewForm.rating,
        review_title: reviewForm.review_title.trim(),
        review_text: reviewForm.review_text.trim(),
      }),
    });

    if (!response.ok) throw new Error("Failed to update review");

    const data = await response.json();
    if (data.status) {
      setReview(data.review);
      setSuccessMessage("Review updated successfully!");
    }
  };

  const deleteReview = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/product-review`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ review_id: review.review_id }),
      });

      if (!response.ok) throw new Error("Failed to delete review");

      const data = await response.json();
      if (data.status) {
        setReview(null);
        setReviewForm({ rating: 0, review_title: "", review_text: "" });
        setSuccessMessage("Review deleted successfully!");
      }
    } catch (err) {
      setError("Failed to delete review. Please try again.");
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview();
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={
              interactive
                ? () => {
                    onRatingChange(star);
                    setValidationError("");
                  }
                : undefined
            }
            className={`transition-transform ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
            style={{
              color:
                star <= rating
                  ? "var(--color-secondary)"
                  : "var(--color-border-strong)",
            }}
          >
            <Star
              className="w-10 h-10"
              fill={star <= rating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
    );
  };

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      setSuccessMessage("");
      setError("");
      setValidationError("");
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-center">
            <Loader className="w-12 h-12 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-primary)",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 mb-4 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h3
            className="text-3xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {review ? "Edit Your Review" : "Write a Review"}
          </h3>
          {product && (
            <p
              className="text-lg mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {product.product_name}
            </p>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            className="mb-2 p-4  border flex items-center space-x-3"
            style={{
              backgroundColor: "var(--color-success-light)",
              borderColor: "var(--color-success)",
              color: "var(--color-success)",
            }}
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mb-2 p-4  border flex items-center space-x-3"
            style={{
              backgroundColor: "var(--color-danger-light)",
              borderColor: "var(--color-danger)",
              color: "var(--color-danger)",
            }}
          >
            <AlertCircle className="w-6 h-6" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div
            className="mb-6 p-4  border flex items-center space-x-3"
            style={{
              backgroundColor: "var(--color-danger-light)",
              borderColor: "var(--color-danger)",
              color: "var(--color-danger)",
            }}
          >
            <AlertCircle className="w-6 h-6" />
            <span className="font-medium">{validationError}</span>
          </div>
        )}

        {/* Review Form */}
        <div
          className="border  p-8"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <form onSubmit={submitReview}>
            {/* Rating */}
            <div className="mb-4">
              <label
                className="block text-lg font-semibold mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Rating <span className="text-red-500">*</span>
              </label>
              {renderStars(reviewForm.rating, true, (rating) =>
                setReviewForm((prev) => ({ ...prev, rating }))
              )}
            </div>

            {/* Review Title */}
            <div>
              <label
                className="block text-lg font-semibold mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={reviewForm.review_title}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    review_title: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border  focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                }}
                placeholder="e.g. Great product, fast delivery!"
                maxLength={100}
              />
              <p
                className="text-sm mt-2 text-right"
                style={{ color: "var(--color-text-muted)" }}
              >
                {reviewForm.review_title.length}/100
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label
                className="block text-lg font-semibold mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewForm.review_text}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    review_text: e.target.value,
                  }))
                }
                rows={6}
                className="w-full px-4 py-3 border  focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                }}
                placeholder="Share your experience... What did you like or dislike? How was the quality?"
                maxLength={500}
              />
              <p
                className="text-sm mt-2 text-right"
                style={{ color: "var(--color-text-muted)" }}
              >
                {reviewForm.review_text.length}/500
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-2">
              <div>
                {review && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="flex items-center space-x-2 px-5 py-3  border font-medium transition hover:opacity-90"
                    style={{
                      backgroundColor: "var(--color-danger-light)",
                      color: "var(--color-danger)",
                      borderColor: "var(--color-danger)",
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Review</span>
                  </button>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3  border font-medium transition"
                  style={{
                    backgroundColor: "var(--color-bg-alt)",
                    color: "var(--color-text-primary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-8 py-3  font-medium disabled:opacity-70 disabled:cursor-not-allowed transition"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-on-primary)",
                    borderColor: "var(--color-primary)",
                  }}
                >
                  {reviewLoading ? (
                    <>Submitting...</>
                  ) : review ? (
                    "Update Review"
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
