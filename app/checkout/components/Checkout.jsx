"use client";

import { useState, useEffect } from "react";
import { useRazorpay } from "react-razorpay";
import Cookies from "js-cookie";
import { useStore } from "../../../stores/useStore";
import {
  Shield,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Home,
  Mail,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { states, cities } from "../../../data/indianStatesCities";

const Checkout = () => {
  const token = Cookies.get("auth_token");
  const router = useRouter();
  const { cart, checkedOrder, signOrder, clearCart, signAmount } = useStore();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_code: "+91",
    phone: "",
    shipping_address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    shipping_method: "standard",
    paymentMethod: "ONLINE",
    notes: "",
  });

  const [error, setError] = useState("");
  const [totals, setTotals] = useState({
    subtotal: 0,
    gst: 0,
    discount: 0,
    finalAmount: 0,
  });

  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all states once (lazy load country-state-city)
  // Load all states from local data
  useEffect(() => {
    setStateOptions(states);
  }, []);

  // When state changes, load cities from local data
  useEffect(() => {
    if (!form.state) {
      setCityOptions([]);
      return;
    }

    const selectedState = states.find((s) => s.name === form.state);
    if (selectedState) {
      const stateCities = cities[selectedState.isoCode];
      if (Array.isArray(stateCities)) {
        setCityOptions(stateCities);
      } else {
        setCityOptions([]);
      }
    }
  }, [form.state]);

  // Calculate totals from checkedOrder
  useEffect(() => {
    if (checkedOrder) {
      const subtotal = checkedOrder.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const gst = checkedOrder.items.reduce(
        (sum, item) => sum + item.gst_amount,
        0
      );
      const discount = checkedOrder.items.reduce(
        (sum, item) => sum + (item.discount || 0),
        0
      );
      setTotals({
        subtotal: parseFloat(subtotal.toFixed(2)),
        gst: parseFloat(gst.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        finalAmount: parseFloat(checkedOrder.final_amount.toFixed(2)),
      });
    }
  }, [checkedOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate pincode to only allow 6 digits
    if (name === "pincode") {
      // Only allow digits and max 6 characters
      if (value && (!/^\d*$/.test(value) || value.length > 6)) {
        return;
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const {
    error: razorpayError,
    isLoading: isRazorpayLoading,
    Razorpay,
  } = useRazorpay();

  useEffect(() => {
    if (razorpayError) {
      console.error("Razorpay SDK failed to load:", razorpayError);
      setError(
        "Payment gateway failed to load. Please check your internet connection or disable ad-blockers and refresh the page."
      );
    }
  }, [razorpayError]);

  const handlePlaceOrder = async () => {
    const requiredFields = [
      "name",
      "email",
      "phone_code",
      "phone",
      "shipping_address",
      "city",
      "state",
      "country",
      "pincode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !form[field]?.trim()
    );
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid Indian phone number");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for order submission
      const formData = new FormData();

      // Append all form fields
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone_code", form.phone_code);
      formData.append("phone", form.phone);
      formData.append("country", form.country);
      formData.append("state", form.state);
      formData.append("city", form.city);
      formData.append("pincode", form.pincode);
      formData.append("address", form.shipping_address);
      formData.append("shipping_address", form.shipping_address);
      formData.append("billing_address", form.shipping_address);
      formData.append("shipping_method", form.shipping_method);
      formData.append("notes", form.notes);
      formData.append("payment_method", form.paymentMethod);

      if (signOrder) {
        formData.append("order", signOrder);
      } else {
        throw new Error("Order data is missing");
      }

      if (form.paymentMethod === "ONLINE") {
        const resRazorpay = await fetch(`${apiUrl}/api/v1/payment/razorpay`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ signAmount }),
        });
        const dataRazorpay = await resRazorpay.json();

        if (!dataRazorpay.status) {
          throw new Error(dataRazorpay.message || "Failed to initiate payment");
        }

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          throw new Error(
            "Razorpay Key ID is missing. Please check your environment variables."
          );
        }

        const options = {
          key: razorpayKey,
          amount: dataRazorpay.order.amount,
          currency: dataRazorpay.order.currency,
          name: "IMD Hardware",
          description: "Order Payment",
          order_id: dataRazorpay.order.id,
          handler: async (response) => {
            try {
              // Add Razorpay payment details to formData
              formData.append(
                "razorpay_payment_id",
                response.razorpay_payment_id
              );
              formData.append("razorpay_order_id", response.razorpay_order_id);
              formData.append(
                "razorpay_signature",
                response.razorpay_signature
              );

              // Confirm order
              const resConfirm = await fetch(`${apiUrl}/api/v1/order/confirm`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData, // FormData automatically sets Content-Type to multipart/form-data
              });

              const dataConfirm = await resConfirm.json();

              if (dataConfirm?.status) {
                // alert("Order placed successfully!");
                clearCart();
                router.push("/dashboard/orders");
              } else {
                setError(dataConfirm?.message || "Failed to confirm order");
              }
            } catch (confirmError) {
              console.error("Order confirmation error:", confirmError);
              setError(
                "Payment successful but failed to confirm order. Please contact support."
              );
            }
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#F37254",
          },
        };

        if (!Razorpay) {
          throw new Error("Razorpay SDK not loaded. Please refresh the page.");
        }

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          setError(`Payment failed: ${response.error.description}`);
        });
        razorpayInstance.open();
      } else {
        // Handle COD or other methods if needed
        // For now just error or implement similar logic for COD
        setError("Only Online payment is currently supported in this flow.");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setError(err.message || "Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  if (!checkedOrder || cart.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-lg"
        style={{ color: "var(--color-text-muted)" }}
      >
        Your cart is empty or order details are missing. Please add items and
        verify your order.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-6xl mx-auto px-4 lg:grid lg:grid-cols-12 gap-8">
        {/* Shipping Form */}
        <div
          className="lg:col-span-8 shadow-sm border p-6 space-y-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Shipping Details
          </h2>
          {error && (
            <p
              className="text-sm border p-2"
              style={{
                color: "var(--color-text-primary)",
                backgroundColor: "var(--color-bg-alt)",
                borderColor: "var(--color-border)",
              }}
            >
              {error}
            </p>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Personal Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type="text"
                    name="name"
                    value={form.name || "janak"}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border focus:ring-2"
                    style={{
                      borderColor: "var(--color-border)",
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email || "cicaral862@datoinf.com"}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border focus:ring-2"
                    style={{
                      borderColor: "var(--color-border)",
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="relative w-24">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type="text"
                    name="phone_code"
                    value={form.phone_code}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border"
                    style={{ borderColor: "var(--color-border)" }}
                    required
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone || "9876543210"}
                  onChange={handleChange}
                  className="flex-1 py-2 px-3 border focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div
            className="space-y-4 pt-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="flex items-center gap-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Address Information</span>
            </div>

            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Shipping Address
              </label>
              <div className="relative">
                <Home
                  className="absolute left-3 top-3 h-4 w-4"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <textarea
                  name="shipping_address"
                  value={form.shipping_address || "221B Baker Street, London"}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                  rows="3"
                  placeholder="Your complete shipping address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Country
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                >
                  <option value="India">India</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  State
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                  required
                >
                  <option value="">Select State</option>
                  {stateOptions.map((s) => (
                    <option key={s.isoCode} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  City
                </label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                  required
                >
                  <option value="">Select City</option>
                  {cityOptions.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Pincode (6 digits)
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  pattern="\d{6}"
                  className="w-full py-2 px-3 border focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                  placeholder="Enter 6-digit pincode"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div
            className="space-y-4 pt-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Order Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full py-2 px-3 border focus:ring-2"
                style={{
                  borderColor: "var(--color-border)",
                  "--tw-ring-color": "var(--color-primary)",
                }}
                rows="3"
                placeholder="e.g., Please deliver between 10AM - 6PM, special instructions, etc."
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div
            className="shadow-sm border p-6 space-y-4 sticky top-4"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              Order Summary
            </h2>
            <div className="space-y-4">
              {/* Items Table */}
              <table
                className="w-full text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <th className="text-left py-2">Image</th>
                    <th className="text-left py-2">Item</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Discount</th>
                    <th className="text-right py-2">GST %</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedOrder.items.map((item) => (
                    <tr
                      key={item.product_id}
                      className="border-b"
                      style={{ borderColor: "var(--color-border-light)" }}
                    >
                      {/* Product Image */}
                      <td>
                        <img
                          src={`${apiUrl}/image/product/${item.images[0]}`}
                          alt={item.name}
                          className="p-2 w-15 aspect-[1/1] object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </td>

                      {/* Product Name */}
                      <td className="py-2">{item.name}</td>

                      {/* Quantity */}
                      <td className="text-right py-2">{item.quantity}</td>

                      {/* Price */}
                      <td className="text-right py-2">
                        ₹{item.price.toFixed(2)}
                      </td>

                      {/* Discount */}
                      <td className="text-right py-2">
                        {item.is_discount ? (
                          item.discount && item.discount > 0 ? (
                            <span
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              -₹{item.discount.toFixed(2)}
                              {item.discount_percent
                                ? ` (${item.discount_percent.toFixed(0)}%)`
                                : ""}
                            </span>
                          ) : (
                            "₹0.00"
                          )
                        ) : (
                          <span style={{ color: "var(--color-text-primary)" }}>
                            Not Eligible
                          </span>
                        )}
                      </td>

                      {/* GST */}
                      <td className="text-right py-2">
                        {item.gst_rate}% (₹{item.gst_amount.toFixed(2)})
                      </td>

                      {/* Total */}
                      <td className="text-right py-2">
                        ₹{item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Table */}
              <table
                className="w-full text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <tbody>
                  <tr>
                    <td className="py-1">Subtotal</td>
                    <td className="text-right py-1">
                      ₹{totals.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">GST Included</td>
                    <td className="text-right py-1">
                      ₹{totals.gst.toFixed(2)}
                    </td>
                  </tr>

                  {checkedOrder.discount_type && (
                    <>
                      <tr>
                        <td className="py-1">Discount Type</td>
                        <td className="text-right py-1 capitalize">
                          {checkedOrder.discount_type}
                        </td>
                      </tr>

                      {checkedOrder.coupon_code && (
                        <tr>
                          <td className="py-1">Coupon Code</td>
                          <td className="text-right py-1 capitalize">
                            {checkedOrder.coupon_code}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td
                          className="py-1"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          Total Discount
                        </td>
                        <td
                          className="text-right py-1"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          -₹
                          {checkedOrder.discount_value}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr
                    className="border-t font-bold"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <td className="py-2">Final Amount</td>
                    <td className="text-right py-2">
                      ₹{totals.finalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="pt-4 border-t text-sm"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-muted)",
              }}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <Shield size={14} /> Secure Payment
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={14} /> Fast Delivery
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard size={14} /> Easy Refunds
                </div>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              // disabled={
              //   loading || (form.paymentMethod === "ONLINE")
              // }
              className="w-full py-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-sm mt-4 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
              }}
            >
              {loading ? (
                <>
                  <div
                    className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                    style={{ borderColor: "var(--color-text-on-primary)" }}
                  ></div>
                  Processing...
                </>
              ) : (
                `Place Order - ₹${totals.finalAmount.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
