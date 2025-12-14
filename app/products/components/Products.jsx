"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
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
  Check,
  ChevronDown,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "../../../stores/useStore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const FilterDropdown = ({ title, options, selectedValues, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside (simple implementation)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.filter-dropdown-${title.replace(/\s+/g, "")}`)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, title]);

  return (
    <div
      className={`relative filter-dropdown-${title.replace(/\s+/g, "")}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all"
        style={{
          backgroundColor: isOpen
            ? "var(--color-bg-alt)"
            : "var(--color-surface)",
          borderColor: isOpen ? "var(--color-primary)" : "var(--color-border)",
          color: isOpen ? "var(--color-primary)" : "var(--color-text-primary)",
        }}
      >
        {title}
        {selectedValues.length > 0 && (
          <span
            className="flex items-center justify-center w-5 h-5 text-xs rounded-full"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
            }}
          >
            {selectedValues.length}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-60 z-50 rounded-lg shadow-xl border p-2 max-h-80 overflow-y-auto"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-light)",
          }}
        >
          {options.map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <div
                key={option}
                onClick={() => onToggle(option)}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? "bg-primary border-primary" : "border-gray-400"
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? "var(--color-primary)"
                      : "transparent",
                    borderColor: isSelected
                      ? "var(--color-primary)"
                      : "var(--color-border-strong)",
                  }}
                >
                  {isSelected && (
                    <Check size={12} color="var(--color-text-on-primary)" />
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {option}
                </span>
              </div>
            );
          })}
          {options.length === 0 && (
            <div className="p-2 text-center text-sm text-gray-500">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Products = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const { products, cart, addToCart, updateCartQuantity, removeFromCart } =
    useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visibleCount, setVisibleCount] = useState(8);

  // --- Filter States (Arrays) ---
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]); // [min, max]

  // Initialize category from query parameter on component mount
  useEffect(() => {
    const categoryFromQuery = searchParams.get("category");
    if (categoryFromQuery) {
      setSelectedCategories(categoryFromQuery.split(","));
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  useEffect(() => {
    const materialFromQuery = searchParams.get("material");
    if (materialFromQuery) {
      setSelectedMaterials(materialFromQuery.split(","));
    } else {
      setSelectedMaterials([]);
    }
  }, [searchParams]);

  // Update query parameters
  const updateQueryParam = useCallback(
    (key, values) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const handleCategoryToggle = (category) => {
    let newCategories;
    if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter((c) => c !== category);
    } else {
      newCategories = [...selectedCategories, category];
    }
    // Update State
    setSelectedCategories(newCategories);
    // Update URL
    updateQueryParam("category", newCategories);
  };

  const handleMaterialToggle = (material) => {
    let newMaterials;
    if (selectedMaterials.includes(material)) {
      newMaterials = selectedMaterials.filter((m) => m !== material);
    } else {
      newMaterials = [...selectedMaterials, material];
    }
    setSelectedMaterials(newMaterials);
    updateQueryParam("material", newMaterials);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setPriceRange([0, 10000]);
    router.push(pathname, { scroll: false });
  };

  // --- Unique categories and materials from products ---
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category_name))].filter(Boolean),
    [products]
  );
  const materials = useMemo(
    () => [...new Set(products.map((p) => p.material))].filter(Boolean),
    [products]
  );

  // --- Filtered products ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const inCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category_name);
      const inMaterial =
        selectedMaterials.length === 0 ||
        selectedMaterials.includes(p.material);
      const inPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return inCategory && inMaterial && inPrice;
    });
  }, [products, selectedCategories, selectedMaterials, priceRange]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Filters Bar */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: `1px solid var(--color-border)`,
        }}
        className="sticky top-0 z-40 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
            <div className="flex items-center gap-2 mr-2">
              <Filter
                className="h-5 w-5"
                style={{ color: "var(--color-text-secondary)" }}
              />
              <span
                className="font-semibold text-sm"
                style={{ color: "var(--color-text-primary)" }}
              >
                Filters
              </span>
            </div>

            {/* Category Dropdown */}
            <FilterDropdown
              title="Category"
              options={categories}
              selectedValues={selectedCategories}
              onToggle={handleCategoryToggle}
            />

            {/* Material Dropdown */}
            <FilterDropdown
              title="Material"
              options={materials}
              selectedValues={selectedMaterials}
              onToggle={handleMaterialToggle}
            />

            {(selectedCategories.length > 0 ||
              selectedMaterials.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm underline underline-offset-4 hover:opacity-80 transition-opacity"
                style={{ color: "var(--color-danger)" }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Price Range */}
          <div
            className="w-full md:w-64 flex flex-col pt-2 md:pt-0"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <div className="flex justify-between mb-1">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Price Range
              </span>
            </div>
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
            <div className="flex justify-between">
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
              {selectedCategories.length === 1
                ? `${selectedCategories[0]} Products`
                : "All Products"}
            </h2>
            <p
              className="mt-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {filteredProducts.length} items found
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            {/* Can add sort here if needed */}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        {/* Load More */}
        {filteredProducts.length > 8 && (
          <div className="flex justify-center mt-12 gap-4">
            {visibleCount < filteredProducts.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-8 py-3 transition-colors font-semibold flex items-center gap-2 rounded-lg"
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
                className="border px-8 py-3 transition-colors font-semibold hover:bg-[var(--color-bg-alt)] rounded-lg"
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
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-surface-alt)",
                color: "var(--color-primary)",
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Products;
