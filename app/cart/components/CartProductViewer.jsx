"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "../../../stores/useStore";
import Cookies from "js-cookie";
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  X,
  ShoppingCart,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CartProductViewer = () => {
  const router = useRouter();
  const token = Cookies.get("auth_token");
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    couponCode,
    coupon,
    addCouponCode,
    addCoupon,
    clearCoupon,
    addCheckedOrder,
    addSignOrder,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  const [totals, setTotals] = useState({
    baseSubtotal: 0, // Price × Quantity (no GST, no discount)
    taxableSubtotal: 0, // Price × Quantity - Discount (for GST calculation)
    totalGst: 0,
    totalDiscount: 0,
    itemTotalWithGst: 0, // Price × Quantity + GST (what backend calls total_amount)
    finalAmount: 0, // Final payable amount (what backend calls final_amount)
  });

  const hasDiscountEligibleProducts = cart.some((p) => p.is_discount);

  // Apply Coupon
  const applyCoupon = async () => {
    if (!couponCode?.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    if (!hasDiscountEligibleProducts) {
      setCouponError("No products in cart are eligible for discounts");
      return;
    }

    setLoading(true);
    setCouponError("");
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/coupon/get/${couponCode.trim()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data?.status && data?.coupon) {
        addCoupon(data.coupon);
      } else {
        setCouponError(data?.message || "Invalid or inactive coupon");
      }
    } catch (err) {
      console.error("Coupon error:", err);
      setCouponError("Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    clearCoupon();
    setCouponError("");
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setCheckoutError("Your cart is empty");
      return;
    }

    setLoading(true);
    setCheckoutError("");

    try {
      const response = await fetch(`${apiUrl}/api/v1/order/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          coupon_code: coupon ? coupon.code : null,
        }),
      });

      const data = await response.json();

      if (data?.status && data?.orderChecked && data?.signOrder) {
        addCheckedOrder(data.orderChecked);
        addSignOrder(data.signOrder);
        router.push("/checkout");
      } else {
        setCheckoutError(data?.message || "Checkout failed");
      }
    } catch (err) {
      console.error(err);
      setCheckoutError("Server error");
    } finally {
      setLoading(false);
    }
  };

  // CORRECT CALCULATION — MATCHES BACKEND EXACTLY
  useEffect(() => {
    let baseSubtotal = 0; // Price × Quantity (no GST, no discount)
    let taxableSubtotal = 0; // Price × Quantity - Discount (for GST calculation)
    let totalGst = 0;
    let itemWiseDiscounts = 0;

    // First pass: Calculate item-level discounts and taxable values
    cart.forEach((product) => {
      const price = parseFloat(product.price);
      const gstRate = parseFloat(product.gst || 0);
      const qty = product.quantity;

      const itemBase = price * qty;
      baseSubtotal += itemBase;

      // Percentage discount (only on eligible items)
      let itemDiscount = 0;
      if (
        coupon &&
        coupon.discount_type === "percentage" &&
        product.is_discount
      ) {
        itemDiscount = parseFloat(
          ((itemBase * coupon.discount_value) / 100).toFixed(2)
        );
        itemWiseDiscounts += itemDiscount;
      }

      const taxable = itemBase - itemDiscount;
      taxableSubtotal += taxable;

      const gst = parseFloat(((taxable * gstRate) / 100).toFixed(2));
      totalGst += gst;
    });

    // Handle flat coupon discount
    let totalDiscount = 0;
    if (coupon && coupon.discount_type === "flat") {
      totalDiscount = parseFloat(coupon.discount_value);
    } else {
      totalDiscount = itemWiseDiscounts;
    }

    // Max discount cap
    if (coupon?.max_discount && totalDiscount > coupon.max_discount) {
      totalDiscount = coupon.max_discount;
    }

    // Min order amount check
    if (coupon?.min_order_amount && baseSubtotal < coupon.min_order_amount) {
      setCouponError(`Minimum order amount is ₹${coupon.min_order_amount}`);
      clearCoupon();
      return;
    }

    // Round all values
    baseSubtotal = parseFloat(baseSubtotal.toFixed(2));
    taxableSubtotal = parseFloat(taxableSubtotal.toFixed(2));
    totalGst = parseFloat(totalGst.toFixed(2));
    totalDiscount = parseFloat(totalDiscount.toFixed(2));

    // Calculate amounts matching backend
    const itemTotalWithGst = parseFloat((baseSubtotal + totalGst).toFixed(2));

    let finalAmount;
    if (coupon?.discount_type === "flat") {
      // For flat coupons: final = (price*qty + GST) - flatDiscount
      finalAmount = parseFloat((itemTotalWithGst - totalDiscount).toFixed(2));
    } else {
      // For percentage coupons: final = taxableSubtotal + GST - totalDiscount
      // (Discount is already subtracted in taxableSubtotal, so this subtracts it TWICE to match backend)
      finalAmount = parseFloat(
        (taxableSubtotal + totalGst - totalDiscount).toFixed(2)
      );
    }

    setTotals({
      baseSubtotal,
      taxableSubtotal,
      totalGst,
      totalDiscount,
      itemTotalWithGst,
      finalAmount,
    });
  }, [cart, coupon]);

  // Empty Cart
  if (cart.length === 0) {
    return (
      <div
        className="min-h-screen py-12"
        style={{
          backgroundColor: "var(--color-bg)",
          fontFamily: "var(--font-body)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShoppingCart
            className="mx-auto h-24 w-24 mb-6"
            style={{ color: "var(--color-text-light)" }}
          />
          <h2
            className="text-3xl font-bold mb-4"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Your cart is empty
          </h2>
          <p className="mb-8" style={{ color: "var(--color-text-secondary)" }}>
            Start shopping to add items
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-8 py-3 hover:opacity-90 font-semibold transition-opacity rounded"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Shopping Cart
          </h1>
          <p className="mt-2" style={{ color: "var(--color-text-secondary)" }}>
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div
              className="shadow-sm overflow-hidden rounded-lg"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="px-6 py-4"
                style={{
                  backgroundColor: "var(--color-bg-alt)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Cart Items
                </h2>
              </div>

              <div
                className="divide-y"
                style={{ borderColor: "var(--color-border)" }}
              >
                {cart.map((product) => (
                  <div
                    key={product.product_id}
                    className="p-6 flex items-start space-x-4"
                  >
                    <img
                      src={`${apiUrl}/image/product/${product.images[0]}`}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded border"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <div className="flex-1">
                      <h3
                        className="text-lg font-medium"
                        style={{
                          color: "var(--color-text-primary)",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {product.title}
                      </h3>
                      <p
                        className="text-2xl font-bold mt-1"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ₹{parseFloat(product.price).toFixed(2)}
                      </p>
                      {product.gst > 0 && (
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          + {product.gst}% GST Included
                        </p>
                      )}
                      {!product.is_discount && (
                        <span
                          className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded"
                          style={{
                            backgroundColor: "var(--color-bg-alt)",
                            color: "var(--color-text-primary)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          Not eligible for discount
                        </span>
                      )}
                    </div>

                    <div className="text-right space-y-3">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              product.product_id,
                              product.quantity - 1
                            )
                          }
                          className="w-9 h-9 rounded border flex items-center justify-center hover:bg-gray-100"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              product.product_id,
                              product.quantity + 1
                            )
                          }
                          className="w-9 h-9 rounded border flex items-center justify-center hover:bg-gray-100"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        ₹{(product.price * product.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(product.product_id)}
                        className="text-sm flex items-center space-x-1 hover:underline"
                        style={{ color: "var(--color-danger)" }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div
              className="sticky top-6 rounded-lg shadow-sm"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="px-6 py-4"
                style={{
                  backgroundColor: "var(--color-bg-alt)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Coupon */}
                {!coupon ? (
                  <div className="space-y-3">
                    <div
                      className="flex items-center space-x-2 text-sm font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      <Tag className="h-4 w-4" />
                      <span>Have a coupon code?</span>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode || ""}
                        onChange={(e) =>
                          addCouponCode(e.target.value.toUpperCase())
                        }
                        onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="Enter code"
                        disabled={!hasDiscountEligibleProducts || loading}
                        className="flex-1 px-4 py-2 border rounded text-sm"
                        style={{
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-surface)",
                        }}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={loading || !hasDiscountEligibleProducts}
                        className="px-5 py-2 rounded font-medium disabled:opacity-50"
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "var(--color-text-on-primary)",
                        }}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                    {!hasDiscountEligibleProducts && (
                      <p
                        className="text-xs text-center py-2"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        No discount-eligible items in cart
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    className="p-4 rounded border flex justify-between items-center"
                    style={{
                      backgroundColor: "#ecfdf5",
                      borderColor: "#10b981",
                    }}
                  >
                    <div
                      className="flex items-center space-x-2 font-medium"
                      style={{ color: "#059669" }}
                    >
                      <Tag className="h-5 w-5" />
                      <span>{coupon.code}</span>
                      <span className="text-sm">
                        (
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `₹${coupon.discount_value}`}{" "}
                        off)
                      </span>
                    </div>
                    <button onClick={removeCoupon} className="hover:opacity-70">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {(couponError || checkoutError) && (
                  <p
                    className="p-3 rounded text-sm"
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fca5a5",
                    }}
                  >
                    {couponError || checkoutError}
                  </p>
                )}

                {/* Totals */}
                <div
                  className="pt-4 space-y-3 border-t"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {/* This matches backend's "total_amount" */}
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span>Item Total (with GST)</span>
                    <span>₹{totals.itemTotalWithGst.toFixed(2)}</span>
                  </div>

                  <div
                    className="flex justify-between text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <span>GST Amount</span>
                    <span>₹{totals.totalGst.toFixed(2)}</span>
                  </div>

                  {totals.totalDiscount > 0 && (
                    <div
                      className="flex justify-between font-semibold"
                      style={{ color: "#059669" }}
                    >
                      <span>Discount Applied</span>
                      <span>-₹{totals.totalDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div
                    className="pt-4 border-t-2 border-dashed flex justify-between text-xl font-bold"
                    style={{
                      borderColor: "var(--color-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <span>Total to Pay</span>
                    <span>₹{totals.finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-on-primary)",
                  }}
                >
                  {loading ? (
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    `Proceed to Checkout → ₹${totals.finalAmount.toFixed(2)}`
                  )}
                </button>

                <button
                  onClick={() => router.push("/products")}
                  className="w-full py-3 border rounded-lg font-medium"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  Continue Shopping
                </button>

                <div
                  className="pt-6 border-t flex justify-center space-x-8 text-sm"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductViewer;
