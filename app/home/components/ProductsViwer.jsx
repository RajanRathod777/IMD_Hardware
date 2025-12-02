"use client";
import { useState } from "react";
import {
  Loader,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "../../../stores/useStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProductsViewer = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

  const { products, cart, addToCart, updateCartQuantity, removeFromCart } =
    useStore();

  const [visibleCount, setVisibleCount] = useState(5);
  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="m-1" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Products Grid */}
      <div className="container w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-2 md:mt-0">
            {/* Name */}
            <h3
              className="text-3xl font-bold py-3 text-left"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Products
            </h3>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
          {visibleProducts.map((product) => {
            const inCart = cart.find(
              (p) => p.product_id === product.product_id
            );
            return (
              <div
                key={product.product_id}
                className="border overflow-hidden"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                {/* Image Container */}
                <div
                  className="relative overflow-hidden"
                  style={{ width: "100%", aspectRatio: "1/1", display: "flex" }}
                >
                  <Link
                    href={`/product/${product.product_id}`}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Swiper
                      modules={[Pagination]}
                      spaceBetween={0}
                      slidesPerView={1}
                      pagination={{ clickable: true }}
                      className="!overflow-hidden !w-full !h-full"
                    >
                      {product.images && product.images.length > 0 ? (
                        product.images.map((image, index) => (
                          <SwiperSlide
                            key={index}
                            className="!w-full !h-full !p-0"
                          >
                            <img
                              src={`${apiUrl}/image/product/${image}`}
                              alt={product.title}
                              loading="eager"
                              className="w-full h-full object-cover"
                              style={{ aspectRatio: "1/1" }}
                            />
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide className="!w-full !h-full !p-0">
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            No Image
                          </div>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  </Link>
                </div>

                {/* Product Info */}
                <div
                  className="p-1 pt-0"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  {/* Product Name */}
                  <Link href={`/product/${product.product_id}`}>
                    <h2
                      className="font-bold truncate"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {product.name}
                    </h2>
                  </Link>

                  <div
                    className="font-semibold text-sm truncate"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {product.title}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  <span>{product.product_id}</span>

                  {/* Cart Controls */}
                  {inCart ? (
                    <div
                      className="flex items-center justify-between p-1 border"
                      style={{
                        backgroundColor: "var(--color-bg-alt)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              product.product_id,
                              inCart.quantity - 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border transition-all duration-200"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            borderColor: "var(--color-border)",
                          }}
                        >
                          <Minus
                            className="h-4 w-4"
                            style={{ color: "var(--color-text-primary)" }}
                          />
                        </button>
                        <span
                          className="font-semibold min-w-8 text-center text-lg"
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
                          className="w-8 h-8 flex items-center justify-center transition-all duration-200"
                          style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-text-on-primary)",
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.product_id)}
                        className="p-1 transition-all duration-200 hover:bg-[var(--color-bg-alt)]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 px-2 font-semibold flex items-center justify-center gap-2 group/btn"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-on-primary)",
                      }}
                    >
                      <ShoppingCart className="h-5 w-5" />

                      {/* Text visible on medium screens and up */}
                      <span className="hidden sm:inline">Add to Cart</span>

                      {/* Arrow visible on medium screens and up */}
                      <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-200 hidden sm:block" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Controls */}
        {products.length > visibleCount && (
          <div className="flex justify-center mt-1 gap-4">
            {visibleCount < products.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + visibleCount)}
                className="px-8 py-2 transition-colors font-semibold flex items-center gap-2"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-on-primary)",
                }}
              >
                Load More Products
                <Plus className="h-5 w-5" />
              </button>
            )}
            {visibleCount > 5 && (
              <button
                onClick={() => setVisibleCount(5)}
                className="border px-8 py-3 transition-colors font-semibold hover:bg-[var(--color-bg-alt)]"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsViewer;
