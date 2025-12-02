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
    subtotal: 0,
    gst: 0,
    discount: 0,
    finalAmount: 0,
  });

  // ✅ Check discount eligibility
  const hasDiscountEligibleProducts = cart.some((p) => p.is_discount);

  // ✅ Apply Coupon
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
        console.log("doupon ,", data.coupon);
      } else {
        setCouponError("Invalid or inactive coupon");
      }
    } catch (err) {
      console.error("Coupon fetch error:", err);
      setCouponError("Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove Coupon
  const removeCoupon = () => {
    clearCoupon();
    setCouponError("");
  };

  // ✅ Checkout API Integration
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
        console.log(data);
        addCheckedOrder(data.orderChecked);
        addSignOrder(data.signOrder);
        router.push("/checkout");
      } else {
        setCheckoutError(data?.message || "Failed to process checkout");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let subtotal = 0;
    let gstTotal = 0;
    let discount = 0;

    cart.forEach((product) => {
      const price = parseFloat(product.price);
      const gstRate = parseFloat(product.gst || 0);
      const quantity = product.quantity;

      const itemBase = price * quantity;
      const gstAmount = (itemBase * gstRate) / 100;
      const itemTotalWithGst = itemBase + gstAmount;

      subtotal += itemTotalWithGst;
      gstTotal += gstAmount;

      // ✅ Only percentage coupons apply per product
      if (
        coupon &&
        coupon.discount_type === "percentage" &&
        product.is_discount
      ) {
        discount += (itemBase * coupon.discount_value) / 100;
      }
    });

    // ✅ Flat discount applies to total subtotal (not per product)
    if (coupon && coupon.discount_type === "flat") {
      discount = coupon.discount_value;
    }

    // ✅ Enforce coupon rules
    if (coupon) {
      if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
        setCouponError(`Minimum order amount is ₹${coupon.min_order_amount}`);
        clearCoupon();
        return;
      }

      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    }

    const finalAmount = Math.max(subtotal - discount, 0);

    setTotals({
      subtotal: parseFloat(subtotal.toFixed(2)),
      gst: parseFloat(gstTotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      finalAmount: parseFloat(finalAmount.toFixed(2)),
    });
  }, [cart, coupon]);

  // ✅ Empty cart UI
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
            className="px-8 py-3 hover:opacity-90 font-semibold transition-opacity"
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

  // ✅ Main UI
  return (
    <div
      className="min-h-screen py-8"
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
              className="shadow-sm overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface)",
                border: `1px solid var(--color-border)`,
              }}
            >
              <div
                className="px-6 py-4"
                style={{
                  backgroundColor: "var(--color-bg-alt)",
                  borderBottom: `1px solid var(--color-border)`,
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
                style={{ borderColor: "var(--color-border)" }}
                className="divide-y"
              >
                {cart.map((product) => (
                  <div
                    key={product.product_id}
                    className="p-6 flex items-start space-x-4"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <img
                      src={`${apiUrl}/image/product/${product.images[0]}`}
                      alt={product.title}
                      className="w-20 h-20 object-cover border"
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
                        ₹{product.price}
                      </p>
                      {product.gst && (
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Includes {product.gst}% GST
                        </p>
                      )}
                      {!product.is_discount && (
                        <span
                          className="mt-2 inline-block px-2 py-1 text-xs"
                          style={{
                            backgroundColor: "var(--color-bg-alt)",
                            color: "var(--color-text-primary)",
                            border: `1px solid var(--color-border)`,
                          }}
                        >
                          ❌ Not eligible for discounts
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              product.product_id,
                              product.quantity - 1
                            )
                          }
                          className="w-8 h-8 border flex justify-center items-center hover:opacity-70 transition-opacity"
                          style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span
                          className="w-8 text-center font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {product.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              product.product_id,
                              product.quantity + 1
                            )
                          }
                          className="w-8 h-8 border flex justify-center items-center hover:opacity-70 transition-opacity"
                          style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p
                        className="text-lg font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        ₹{(product.price * product.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(product.product_id)}
                        className="flex items-center space-x-1 hover:opacity-70 transition-opacity"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-sm">Remove</span>
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
              className="shadow-sm sticky top-8"
              style={{
                backgroundColor: "var(--color-surface)",
                border: `1px solid var(--color-border)`,
              }}
            >
              <div
                className="px-6 py-4"
                style={{
                  backgroundColor: "var(--color-bg-alt)",
                  borderBottom: `1px solid var(--color-border)`,
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
              <div className="p-6 space-y-4">
                {/* Coupon Section */}
                <div className="space-y-3">
                  {!coupon ? (
                    <div className="space-y-2">
                      <label
                        className="flex items-center space-x-2 text-sm font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        <Tag className="h-4 w-4" />
                        <span>Have a coupon?</span>
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode || ""}
                          onChange={(e) =>
                            addCouponCode(e.target.value.toUpperCase())
                          }
                          onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                          disabled={!hasDiscountEligibleProducts}
                          className="flex-1 border px-3 py-2 focus:ring-2 focus:outline-none"
                          style={{
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-surface)",
                            color: "var(--color-text-primary)",
                            "--tw-ring-color": "var(--color-primary)",
                          }}
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={loading || !hasDiscountEligibleProducts}
                          className="px-4 py-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
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
                          className="p-2 text-sm text-center border"
                          style={{
                            backgroundColor: "var(--color-bg-alt)",
                            color: "var(--color-text-primary)",
                            borderColor: "var(--color-border)",
                          }}
                        >
                          No products eligible for discounts
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      className="p-3 flex justify-between items-center border"
                      style={{
                        backgroundColor: "var(--color-bg-alt)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <div
                        className="flex items-center space-x-2 font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        <Tag className="h-4 w-4" />
                        <span>{coupon.code}</span>
                        <span className="text-sm">
                          (
                          {coupon.discount_type === "percentage"
                            ? `${coupon.discount_value}%`
                            : `₹${coupon.discount_value}`}{" "}
                          off)
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="hover:opacity-70 transition-opacity"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p
                      className="text-sm p-2 border"
                      style={{
                        backgroundColor: "var(--color-danger-light)",
                        color: "var(--color-danger)",
                        borderColor: "var(--color-danger)",
                      }}
                    >
                      {couponError}
                    </p>
                  )}
                  {checkoutError && (
                    <p
                      className="text-sm p-2 border"
                      style={{
                        backgroundColor: "var(--color-danger-light)",
                        color: "var(--color-danger)",
                        borderColor: "var(--color-danger)",
                      }}
                    >
                      {checkoutError}
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div
                  className="pt-4 space-y-3"
                  style={{ borderTop: `1px solid var(--color-border)` }}
                >
                  <div
                    className="flex justify-between"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span>Subtotal</span>
                    <span>₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div
                    className="flex justify-between"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span>GST Included</span>
                    <span>₹{totals.gst.toFixed(2)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--color-success)" }}
                    >
                      <span>Discount</span>
                      <span>-₹{totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div
                    className="flex justify-between text-lg font-bold pt-3"
                    style={{
                      borderTop: `1px solid var(--color-border)`,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <span>Total</span>
                    <span>₹{totals.finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 hover:opacity-90 disabled:opacity-50 font-semibold transition-opacity"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-on-primary)",
                  }}
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    `Proceed to Checkout - ₹${totals.finalAmount.toFixed(2)}`
                  )}
                </button>
                <button
                  onClick={() => router.push("/products")}
                  className="w-full py-3 hover:opacity-80 font-medium transition-opacity border"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  Continue Shopping
                </button>

                {/* Trust Icons */}
                <div
                  className="pt-4 flex justify-center space-x-6 text-sm"
                  style={{
                    borderTop: `1px solid var(--color-border)`,
                    color: "var(--color-text-muted)",
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="h-4 w-4" />
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
