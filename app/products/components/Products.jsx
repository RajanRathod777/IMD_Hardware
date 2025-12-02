"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Loader,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Star,
  Shield,
  Truck,
  ArrowRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "../../stores/useStore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Products = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const { products, cart, addToCart, updateCartQuantity, removeFromCart } =
    useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visibleCount, setVisibleCount] = useState(8);
  // --- Filter States ---
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]); // [min, max]

  // Initialize category from query parameter on component mount
  useEffect(() => {
    const categoryFromQuery = searchParams.get("category");
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const materialFromQuery = searchParams.get("material");
    if (materialFromQuery) {
      setSelectedMaterial(materialFromQuery);
    }
  }, [searchParams]);

  // Update query parameters when category changes
  const updateQueryParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    // We handle the update in the onChange handler to avoid infinite loops or double updates
    // But if we want to sync state to URL, we can do it here if state changes from other sources
    // For now, let's just use the updateQueryParam in the onChange handlers
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    updateQueryParam("category", newCategory);
  };

  const handleMaterialChange = (e) => {
    const newMaterial = e.target.value;
    setSelectedMaterial(newMaterial);
    updateQueryParam("material", newMaterial);
  };

  // --- Unique categories and materials from products ---
  const categories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category_name))],
    [products]
  );
  const materials = useMemo(
    () => ["all", ...new Set(products.map((p) => p.material))],
    [products]
  );
  // --- Filtered products ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const inCategory =
        selectedCategory === "all" || p.category_name === selectedCategory;
      const inMaterial =
        selectedMaterial === "all" || p.material === selectedMaterial;
      const inPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return inCategory && inMaterial && inPrice;
    });
  }, [products, selectedCategory, selectedMaterial, priceRange]);
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Filters */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: `1px solid var(--color-border)`,
        }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-wrap gap-4 items-center">
          <Filter
            className="h-5 w-5"
            style={{ color: "var(--color-text-secondary)" }}
          />
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border px-3 py-2 text-sm focus:outline-none"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          {/* Material */}
          <select
            value={selectedMaterial}
            onChange={handleMaterialChange}
            className="border px-3 py-2 text-sm focus:outline-none"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            {materials.map((mat) => (
              <option key={mat} value={mat}>
                {mat === "all" ? "All Materials" : mat}
              </option>
            ))}
          </select>
          {/* Price Range */}
          <div
            className=" w-30  flex flex-col"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <div className="relative py-2 ">
              {/* Track */}
              <div
                className="absolute h-1.5 rounded-full w-full top-1/2 transform -translate-y-1/2"
                style={{ backgroundColor: "var(--color-bg-alt)" }}
              ></div>
              {/* Active Range */}
              <div
                className="absolute h-1.5 rounded-full top-1/2 transform -translate-y-1/2"
                style={{
                  left: `${(priceRange[0] / 10000) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / 10000) * 100}%`,
                  backgroundColor: "var(--color-primary)",
                }}
              ></div>
              {/* Min Thumb */}
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[0]}
                onChange={(e) => {
                  const min = Math.min(+e.target.value, priceRange[1] - 500);
                  setPriceRange([min, priceRange[1]]);
                }}
                className="absolute w-full top-1/2 transform -translate-y-1/2 h-4 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-primary)] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto"
              />
              {/* Max Thumb */}
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => {
                  const max = Math.max(+e.target.value, priceRange[0] + 500);
                  setPriceRange([priceRange[0], max]);
                }}
                className="absolute w-full top-1/2 transform -translate-y-1/2 h-4 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-primary)] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto"
              />
            </div>
            <div className="flex   justify-between">
              <div
                className="text-[10px] font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                ₹{priceRange[0]}
              </div>
              <div
                className="text-[12px] font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                - ₹{priceRange[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2
              className="text-3xl font-bold"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {selectedCategory !== "all"
                ? `${selectedCategory} Products`
                : "Featured Products"}
            </h2>
            <p
              className="mt-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Handpicked items just for you
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Showing {Math.min(visibleCount, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </span>
          </div>
        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleProducts.map((product) => {
            const inCart = cart.find(
              (p) => p.product_id === product.product_id
            );
            return (
              <div
                key={product.product_id}
                className="shadow-sm border overflow-hidden hover:shadow transition-all duration-300 group"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Link href={`/product/${product.product_id}`}>
                    <img
                      src={`${apiUrl}/image/product/${product.images[0]}`}
                      alt={product.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-on-primary)",
                      }}
                    >
                      {product.category_name}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-5">
                  <Link href={`/product/${product.product_id}`}>
                    <h3
                      className="font-semibold line-clamp-2 transition-colors"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {product.name}
                    </h3>
                  </Link>
                  <div>
                    {product.title.length > 50
                      ? product.title.substring(0, 50) + "..."
                      : product.title}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.original_price && (
                      <span
                        className="text-lg line-through"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        ₹{product.original_price}
                      </span>
                    )}
                  </div>
                  {inCart ? (
                    <div
                      className="flex items-center justify-between p-2"
                      style={{ backgroundColor: "var(--color-bg-alt)" }}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              product.product_id,
                              inCart.quantity - 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{
                            backgroundColor: "var(--color-surface-alt)",
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium min-w-8 text-center">
                          {inCart.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              product.product_id,
                              inCart.quantity + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center transition-colors"
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
                        className="p-2 transition-colors"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 transition-colors font-medium flex items-center justify-center gap-2 group/btn"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-on-primary)",
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                      <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Load More */}
        {filteredProducts.length > 8 && (
          <div className="flex justify-center mt-12 gap-4">
            {visibleCount < filteredProducts.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-8 py-3 transition-colors font-semibold flex items-center gap-2"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-on-primary)",
                }}
              >
                Load More Products
                <Plus className="h-5 w-5" />
              </button>
            )}
            {visibleCount > 8 && (
              <button
                onClick={() => setVisibleCount(8)}
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
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart
              className="h-16 w-16 mx-auto mb-4"
              style={{ color: "var(--color-text-muted)" }}
            />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              No products found
            </h3>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Products;
