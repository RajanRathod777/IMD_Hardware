"use client";
import { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "../../../stores/useStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProductsViewer = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

  // Get products and cart actions from store
  const { products, cart, addToCart, updateCartQuantity, removeFromCart } =
    useStore();

  const initialShowProduct = 4;
  const [visibleCount, setVisibleCount] = useState(initialShowProduct);

  // Optional chaining for safety if products is initially undefined/null
  const visibleProducts = products?.slice(0, visibleCount) || [];

  // Calculate if there are more products to show
  const hasMoreProducts = products && products.length > visibleCount;
  const hasMoreThanInitial = visibleCount > initialShowProduct;

  const handleLoadMore = () => {
    // Load next 4 products or remaining products if less than 4
    const nextCount = Math.min(
      visibleCount + 4,
      products?.length || visibleCount
    );
    setVisibleCount(nextCount);
  };

  const handleShowLess = () => {
    // Show 4 less products, but not less than initial count
    const prevCount = Math.max(visibleCount - 4, initialShowProduct);
    setVisibleCount(prevCount);
  };

  return (
    <div>
      {/* Products Grid */}
      <div className="container w-full p-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-2 md:mt-0">
            {/* Name */}
            <h3
              className="text-2xl font-bold py-3 text-left"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Popular Products
            </h3>
          </div>
        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {visibleProducts.map((product) => {
            const inCart = cart.find(
              (p) => p.product_id === product.product_id
            );

            return (
              <div
                key={product.product_id}
                className="p-2 relative border overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                {/* Price Badge */}
                <div
                  className="px-3 py-1.5 z-10 rounded-br-lg absolute top-0 left-0 flex items-center gap-1"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-on-primary)",
                  }}
                >
                  <span className="text-sm font-bold">
                    ₹ {product.price.toFixed(2)}
                  </span>
                </div>

                {/* Image Container */}
                <div
                  className="relative overflow-hidden"
                  style={{ width: "100%", aspectRatio: "1/1" }}
                >
                  <Link
                    href={`/product/${product.product_id}`}
                    className="block w-full h-full hover:opacity-95 transition-opacity duration-200"
                  >
                    <Swiper
                      modules={[Pagination]}
                      spaceBetween={0}
                      slidesPerView={1}
                      pagination={{
                        clickable: true,
                        dynamicBullets: true,
                      }}
                      className="!overflow-hidden !w-full !h-full "
                    >
                      {product.images && product.images.length > 0 ? (
                        product.images.map((image, index) => (
                          <SwiperSlide key={index} className="!w-full !h-full">
                            <div className="relative w-full h-full">
                              <img
                                src={`${apiUrl}/image/product/${image}`}
                                alt={product.title}
                                loading="lazy"
                                className=" rounded-md  w-full h-full object-cover"
                                style={{ aspectRatio: "1/1" }}
                              />
                              {/* Image overlay on hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                            </div>
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide className="!w-full !h-full">
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              backgroundColor: "var(--color-bg-alt)",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            <div className="text-center p-4">
                              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
                              <p className="text-sm">No Image</p>
                            </div>
                          </div>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  </Link>
                </div>

                {/* Product Info */}
                <div
                  className="pt-2 flex flex-col"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  {/* Product Name */}
                  <div className="min-h-12">
                    <Link
                      href={`/product/${product.product_id}`}
                      className="group"
                    >
                      <h2
                        className="truncate font-bold text-sm  mb-1 transition-colors duration-200 group-hover:text-opacity-80"
                        style={{
                          color: "var(--color-text-primary)",
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-semibold)",
                        }}
                      >
                        {product.name}
                      </h2>
                    </Link>

                    <div
                      className=" truncate text-xs "
                      style={{
                        color: "var(--color-text-secondary)",
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-regular)",
                      }}
                    >
                      {product.title}
                    </div>
                  </div>

                  {/* Cart Controls */}
                  <div className="flex w-full items-center gap-2 ">
                    {inCart ? (
                      <>
                        {/* Quantity controls - Compact version */}
                        <div
                          className="flex-1 flex items-center justify-between p-1 rounded-lg border"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            borderColor: "var(--color-border-light)",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                product.product_id,
                                inCart.quantity - 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: "var(--color-surface-alt)",
                              border: "1px solid var(--color-border-light)",
                            }}
                            disabled={inCart.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus
                              className="h-3 w-3"
                              style={{ color: "var(--color-text-primary)" }}
                            />
                          </button>

                          <span
                            className="font-bold min-w-8 text-center text-sm"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {inCart.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartQuantity(
                                product.product_id,
                                inCart.quantity + 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 hover:opacity-90 active:scale-95"
                            style={{
                              backgroundColor: "var(--color-primary)",
                              color: "var(--color-text-on-primary)",
                            }}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(product.product_id)}
                          className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                          style={{
                            color: "var(--color-danger)",
                            backgroundColor: "var(--color-surface-alt)",
                            border: "1px solid var(--color-border-light)",
                          }}
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      // Add to cart button
                      <button
                        onClick={() => addToCart(product)}
                        className="rounded-lg px-3 py-2 font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 w-full group/add"
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "var(--color-text-on-primary)",
                          fontWeight: "var(--font-semibold)",
                        }}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-4 w-4 transition-transform duration-200 group-hover/add:scale-110" />
                        <span
                          className="text-sm"
                          style={{ fontSize: "var(--text-xs)" }}
                        >
                          Add to Cart
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Load More Controls - Minimal Text */}
        <div className="flex justify-center gap-6 mt-6">
          {/* Show Less Button - Only show when we have more than initial products */}
          {hasMoreThanInitial && (
            <button
              onClick={handleShowLess}
              className="px-4 py-2 transition-all duration-200 font-medium underline-offset-4 hover:underline"
              style={{
                color: "var(--color-text-muted)",
                fontWeight: "var(--font-medium)",
                fontSize: "var(--text-sm)",
              }}
            >
              ↑ Show Less
            </button>
          )}

          {/* Load More Button - Only show when there are more products to load */}
          {hasMoreProducts && (
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 transition-all duration-200 font-medium underline-offset-4 hover:underline"
              style={{
                color: "var(--color-primary)",
                fontWeight: "var(--font-medium)",
                fontSize: "var(--text-sm)",
              }}
            >
              Load More ↓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsViewer;
