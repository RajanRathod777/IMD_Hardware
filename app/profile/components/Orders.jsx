"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "../../../components/Loading";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  CreditCard,
  MapPin,
  Loader,
  RotateCcw, // For refunded icon
} from "lucide-react";

export default function Orders() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const token = Cookies.get("auth_token");
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPageInput, setCurrentPageInput] = useState(currentPage);
  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 5;

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/api/v1/order/details/by/user?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      console.log("order data", data);

      if (data.status) {
        setOrders(data.orders);
        setPagination(data.pagination);
        setCurrentPage(data.pagination.currentPage);
        setCurrentPageInput(data.pagination.currentPage);

        // Update next/prev states based on pagination
        setIsNext(data.pagination.hasNextPage);
        setIsPrev(data.pagination.hasPrevPage);
      } else {
        throw new Error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchOrders(page);
  };

  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setCurrentPageInput(value);
  };

  const handlePageInputSubmit = (e) => {
    if (e.key === "Enter") {
      handlePageChange(currentPageInput);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return (
          <Clock
            className="w-4 h-4"
            style={{ color: "var(--color-warning)" }}
          />
        );
      case "shipped":
        return (
          <Truck
            className="w-4 h-4"
            style={{ color: "var(--color-primary)" }}
          />
        );
      case "delivered":
        return (
          <CheckCircle
            className="w-4 h-4"
            style={{ color: "var(--color-success)" }}
          />
        );
      case "cancelled":
        return (
          <XCircle
            className="w-4 h-4"
            style={{ color: "var(--color-danger)" }}
          />
        );
      default:
        return (
          <Package
            className="w-4 h-4"
            style={{ color: "var(--color-text-secondary)" }}
          />
        );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "processing":
        return {
          backgroundColor: "var(--color-warning-light)",
          color: "var(--color-warning)",
        };
      case "shipped":
        return {
          backgroundColor: "var(--color-primary-soft)",
          color: "var(--color-primary)",
        };
      case "delivered":
        return {
          backgroundColor: "var(--color-success-light)",
          color: "var(--color-success)",
        };
      case "cancelled":
        return {
          backgroundColor: "var(--color-danger-light)",
          color: "var(--color-danger)",
        };
      default:
        return {
          backgroundColor: "var(--color-surface-alt)",
          color: "var(--color-text-secondary)",
        };
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return (
          <CheckCircle
            className="w-3 h-3 mr-1"
            style={{ color: "var(--color-success)" }}
          />
        );
      case "pending":
        return (
          <Clock
            className="w-3 h-3 mr-1"
            style={{ color: "var(--color-warning)" }}
          />
        );
      case "failed":
        return (
          <XCircle
            className="w-3 h-3 mr-1"
            style={{ color: "var(--color-danger)" }}
          />
        );
      case "refunded":
        return (
          <RotateCcw
            className="w-3 h-3 mr-1"
            style={{ color: "var(--color-info)" }}
          />
        );
      default:
        return (
          <CreditCard
            className="w-3 h-3 mr-1"
            style={{ color: "var(--color-text-secondary)" }}
          />
        );
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return {
          backgroundColor: "var(--color-success-light)",
          color: "var(--color-success)",
        };
      case "pending":
        return {
          backgroundColor: "var(--color-warning-light)",
          color: "var(--color-warning)",
        };
      case "failed":
        return {
          backgroundColor: "var(--color-danger-light)",
          color: "var(--color-danger)",
        };
      case "refunded":
        return {
          backgroundColor: "var(--color-info-light)",
          color: "var(--color-info)",
        };
      default:
        return {
          backgroundColor: "var(--color-surface-alt)",
          color: "var(--color-text-secondary)",
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="py-8" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 ">
          <div
            className="border p-4 text-center"
            style={{
              backgroundColor: "var(--color-danger-light)",
              borderColor: "var(--color-border)",
            }}
          >
            <XCircle
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--color-danger)" }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Error Loading Orders
            </h3>
            <p className="mb-4" style={{ color: "var(--color-danger)" }}>
              {error}
            </p>
            <button
              onClick={() => fetchOrders(currentPage)}
              className="px-4 py-2 transition-colors"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
              }}
            >
              Try Again
            </button>
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
      }}
    >
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        {orders.length === 0 ? (
          <div
            className="border p-4 text-center"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <Package
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "var(--color-text-muted)" }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              No orders found
            </h3>
            <p
              className="mb-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-3 transition-colors text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="h-[calc(100vh-160px)] max-[1035px]:h-[calc(100vh-270px)] overflow-y-auto space-y-3">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="border overflow-hidden"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {/* Order Header */}
                  <div
                    className="border-b px-3 py-3"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center space-x-4">
                        <Package
                          className="w-5 h-5"
                          style={{ color: "var(--color-text-secondary)" }}
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                            <span
                              className="inline-flex items-center px-3 py-1 text-sm font-medium"
                              style={getStatusStyle(order.order_status)}
                            >
                              {getStatusIcon(order.order_status)}
                              <span className="ml-1 capitalize">
                                {order.order_status}
                              </span>
                            </span>
                            <span
                              className="inline-flex items-center px-3 py-1 text-sm font-medium"
                              style={getPaymentStatusStyle(
                                order.payment_status
                              )}
                            >
                              {getPaymentStatusIcon(order.payment_status)}
                              <span className="capitalize">
                                {order.payment_status}
                              </span>
                            </span>
                          </div>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Order Date : {formatDate(order.created_at)}
                          </p>
                          {order.tracking_number && (
                            <p
                              className="text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              Tracking: {order.tracking_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-3 py-3">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.order_item_id}
                          className="flex items-center space-x-4 py-3 border-b last:border-b-0"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <div
                            className="flex-shrink-0 w-16 h-16 overflow-hidden"
                            style={{ backgroundColor: "var(--color-bg-alt)" }}
                          >
                            {item.image && item.image.length > 0 ? (
                              <img
                                src={`${apiUrl}/image/order/${item.image[0]}`}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                  backgroundColor: "var(--color-bg-alt)",
                                }}
                              >
                                <Package
                                  className="w-6 h-6"
                                  style={{ color: "var(--color-text-muted)" }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className="text-sm font-medium truncate"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {item.product_name}
                            </h4>
                            <p
                              className="text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              Qty: {item.quantity} ×{" "}
                              {formatCurrency(item.price)}
                            </p>
                            {item.discount && (
                              <span
                                className="inline-block text-xs px-2 py-1 mt-1"
                                style={{
                                  backgroundColor: "var(--color-bg-alt)",
                                  color: "var(--color-text-primary)",
                                }}
                              >
                                Discount Applied
                              </span>
                            )}

                            <div>
                              <Link
                                href={`/review/${order.order_id}/${item.product_id}`}
                                className="inline-block text-xs px-2 py-1 mt-1"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                <u>Review</u>
                              </Link>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {formatCurrency(item.total)}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              GST: {item.gst_rate}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div
                    className="border-t px-3 py-3 "
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div
                        className="flex  flex-wrap gap-2 items-center space-x-2 text-sm mb-3 sm:mb-0"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{order.shipping_address}</span>
                      </div>
                      <div className="text-right">
                        <div className="space-y-1">
                          {order.discount_value > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                Discount:
                              </span>
                              <span
                                className="font-medium"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                -{formatCurrency(order.discount_value)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span
                              className="text-base font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              Total:
                            </span>
                            <span
                              className="text-lg font-bold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {formatCurrency(order.final_amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-1 flex items-center justify-center gap-5">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!isPrev || isLoading}
                  className={`w-8 h-8 items-center justify-center border text-sm font-medium flex items-center gap-2 ${
                    isPrev && !isLoading
                      ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  }`}
                >
                  <ChevronLeft />
                </button>

                {/* Page Input */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600"></span>
                  <input
                    type="number"
                    value={currentPageInput}
                    min={1}
                    max={pagination.totalPages}
                    onChange={handlePageInputChange}
                    onKeyPress={handlePageInputSubmit}
                    onBlur={() => handlePageChange(currentPageInput)}
                    className="h-8 border border-gray-300  text-center text-md"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-600">
                    / {pagination.totalPages}
                  </span>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!isNext || isLoading}
                  className={`w-8 h-8 items-center justify-center border text-sm font-medium flex items-center gap-2 ${
                    isNext && !isLoading
                      ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  }`}
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
