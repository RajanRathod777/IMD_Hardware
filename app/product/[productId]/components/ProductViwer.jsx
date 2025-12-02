"use client";
import { useEffect, useState, Suspense, lazy } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "../../../../stores/useStore";
import Cookies from "js-cookie";

// Lazy load heavy 3D component - defer model-viewer import
const ModelViewer3D = lazy(() => import("./ModelViewer3D"));

// Components (regular imports for critical path)
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductReviews from "./ProductReviews";
import MediaGallery from "./MediaGallery";
import BackButton from "./BackButton";
import ExtraProductInfo from "./ExtraProductInfo";

const ProductViewer = () => {
  const params = useParams();
  const productId = params?.productId;
  const router = useRouter();
  const token = Cookies.get("auth_token");
  const { getProductById } = useStore();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

  // State
  const [extraDetails, setExtraDetails] = useState(null);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [modelViewerReady, setModelViewerReady] = useState(false);

  // Get product from store (may be undefined initially)
  const product = getProductById(Number(productId));

  // ------------------------------------------------------------------
  // All hooks must be at the top – NO early returns before this point!
  // ------------------------------------------------------------------

  // Lazy load model-viewer only when product has 3D model
  useEffect(() => {
    if (product?.models_3d?.[0]) {
      import("@google/model-viewer")
        .then(() => {
          setModelViewerReady(true);
        })
        .catch((err) => {
          console.error("Failed to load model-viewer:", err);
        });
    }
  }, [product?.models_3d]);

  useEffect(() => {
    if (!productId) return;

    const fetchMoreDetailsSingleProduct = async () => {
      try {
        setLoadingExtra(true);
        const res = await fetch(`${apiUrl}/api/v1/product/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requireField: ["short_description", "description", "color"],
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch extra details");
        const data = await res.json();
        setExtraDetails(data.product || {});
      } catch (err) {
        console.error("Error fetching extra product details:", err);
      } finally {
        setLoadingExtra(false);
      }
    };

    fetchMoreDetailsSingleProduct();
  }, [productId, apiUrl]);

  useEffect(() => {
    if (!productId) return;

    const fetchProductReview = async (page = 1) => {
      try {
        setReviewsLoading(true);
        const res = await fetch(
          `${apiUrl}/api/v1/product-review/?page=${page}&limit=3&product_id=${productId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data.reviews || []);
        setPagination(data.pagination || null);
      } catch (err) {
        console.error("Error fetching product reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProductReview(1);
  }, [productId, apiUrl, token]);

  // ------------------------------------------------------------------
  // Early return AFTER all hooks
  // ------------------------------------------------------------------
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Product not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Main render
  // ------------------------------------------------------------------

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-7xl mx-auto p-4">
        <BackButton navigate={router.back} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
          <ProductImages product={product} apiUrl={apiUrl} />
          <ProductInfo
            product={product}
            extraDetails={extraDetails}
            loading={loadingExtra}
          />
        </div>

        <ExtraProductInfo extraDetails={extraDetails} loading={loadingExtra} />
        <MediaGallery product={product} apiUrl={apiUrl} />

        {/* Lazy load 3D model viewer - only show when product has 3D model and it's ready */}
        {product?.models_3d?.[0] && modelViewerReady && (
          <Suspense
            fallback={
              <div
                className="mt-8 p-4 text-center"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Loading 3D model...
              </div>
            }
          >
            <ModelViewer3D product={product} apiUrl={apiUrl} />
          </Suspense>
        )}

        <ProductReviews
          reviews={reviews}
          pagination={pagination}
          reviewsLoading={reviewsLoading}
          onPageChange={(page) => {
            // Simple page change handler
            const fetchProductReview = async (page = 1) => {
              try {
                setReviewsLoading(true);
                const res = await fetch(
                  `${apiUrl}/api/v1/product-review/?page=${page}&limit=3&product_id=${productId}`,
                  {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                  }
                );
                if (!res.ok) throw new Error("Failed");
                const data = await res.json();
                setReviews(data.reviews || []);
                setPagination(data.pagination || null);
              } catch (err) {
                console.error(err);
              } finally {
                setReviewsLoading(false);
              }
            };
            fetchProductReview(page);
          }}
        />
      </div>
    </div>
  );
};

export default ProductViewer;
