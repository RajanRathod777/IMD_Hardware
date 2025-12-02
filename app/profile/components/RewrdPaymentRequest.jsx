"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "../../../components/Loading";

const RewardPaymentRequest = () => {
  const token = Cookies.get("auth_token");
  const apiUrl =
    process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:4444";
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageInput, setCurrentPageInput] = useState(1); // Fixed: initialized to 1
  const limit = 5;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchPaymentRequests(1);
  }, []);

  const fetchPaymentRequests = async (page = 1) => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${apiUrl}/api/v1/reward-payment-request/user/my-requests?page=${page}&limit=${limit}`,
        requestOptions
      );
      const result = await response.json();

      console.log("payment requests result", result);
      if (result.status) {
        setRequests(result.requests);
        setPagination(
          result.pagination || {
            currentPage: page,
            totalPages: 1,
            totalRecords: result.requests.length,
            hasNext: false,
            hasPrev: page > 1,
          }
        );
        setCurrentPageInput(page); // Sync input with current page
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to fetch payment requests");
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Proper page change handler
  const handlePageChange = (page) => {
    const pageNumber = parseInt(page);
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      fetchPaymentRequests(pageNumber);
    }
  };

  // Fixed: Handle page input change
  const handlePageInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value >= 1 && value <= pagination.totalPages)) {
      setCurrentPageInput(value === "" ? "" : parseInt(value));
    }
  };

  // Fixed: Handle page input submit
  const handlePageInputSubmit = (e) => {
    if (e.key === "Enter") {
      handlePageChange(currentPageInput);
    }
  };

  // Fixed: Handle input blur
  const handleInputBlur = () => {
    if (currentPageInput === "" || currentPageInput < 1) {
      setCurrentPageInput(pagination.currentPage);
    } else if (currentPageInput > pagination.totalPages) {
      setCurrentPageInput(pagination.totalPages);
    } else {
      handlePageChange(currentPageInput);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchPaymentRequests(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      fetchPaymentRequests(pagination.currentPage - 1);
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

  const getStatusClass = (status) => {
    let classes = "px-2 py-1  border text-sm font-semibold";

    if (status === "Pending") {
      classes += " bg-yellow-100 border-yellow-400 text-yellow-600";
    } else if (status === "Completed") {
      classes += " bg-green-100 border-green-400 text-green-600";
    } else if (status === "Rejected") {
      classes += " bg-red-100 border-red-400 text-red-600";
    } else {
      classes += " bg-gray-100 border-gray-300 text-gray-700";
    }

    return classes;
  };

  // Simple arrow icons component (replace with your actual icons)
  const ChevronLeft = () => <span>‹</span>;
  const ChevronRight = () => <span>›</span>;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div
        className="max-w-4xl mx-auto p-6"
        style={{
          backgroundColor: "var(--color-bg)",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          className="text-center py-10 border"
          style={{
            color: "var(--color-danger)",
            borderColor: "var(--color-border-danger)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-medium)",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="  max-w-4xl mx-auto p-1 bg-orange-50 text-gray-900 text-base">
      {/* Requests List */}
      <div className="h-[calc(100vh-160px)] max-[1035px]:h-[calc(100vh-270px)] overflow-y-auto  space-y-1 ">
        {requests.length === 0 ? (
          <div className="text-center py-10 border border-orange-200 bg-white text-gray-500 text-base font-normal">
            No payment requests found
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.reward_payment_request_id}
              className="border border-orange-200 p-2 bg-white"
            >
              {/* Request Header */}
              <div className="flex justify-between items-center mb-1 pb-2 border-b border-orange-200">
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    ${request.amount}
                  </span>
                  <span className="text-sm text-gray-800 border border-orange-400 bg-orange-100 px-2 py-1 font-medium">
                    {request.payment_method}
                  </span>
                </div>

                <div className={getStatusClass(request.status)}>
                  {request.status}
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-2">
                {request.payment_method === "BankTransfer" && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                        Account Holder Name :
                      </span>
                      <span className="text-right text-gray-600 text-sm">
                        {request.payment_info.account_holder_name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                        Bank Name :
                      </span>
                      <span className="text-right text-gray-600 text-sm">
                        {request.payment_info.bank_name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                        Account Number :
                      </span>
                      <span className="text-right text-gray-600 text-sm">
                        {request.payment_info.account_number}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                        Bank IFC Code :
                      </span>
                      <span className="text-right text-gray-600 text-sm">
                        {request.payment_info.bank_IFC_code}
                      </span>
                    </div>
                  </>
                )}

                {request.payment_method === "UPI" && (
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                        UPI ID:
                      </span>
                      <span className="text-right text-gray-600 text-sm">
                        {request.payment_info.upi_id}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                    Request Date :
                  </span>
                  <span className="text-right text-gray-600 text-sm">
                    {formatDate(request.request_date)}
                  </span>
                </div>

                <p className="py-2 text-sm text-gray-600 flex  border-y border-orange-200 ">
                  Company message
                </p>

                <div className="flex justify-between items-start">
                  <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                    Verified :
                  </span>
                  <span className="text-right text-gray-600 text-sm">
                    {request.is_verified
                      ? request.rejection_reason
                        ? "No"
                        : "Yes"
                      : "No"}
                  </span>
                </div>

                {request.transaction_id && request.processed_date && (
                  <div className="flex justify-between items-start">
                    <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                      Processed Date :
                    </span>
                    <span className="text-right text-gray-600 text-sm">
                      {formatDate(request.processed_date)}
                    </span>
                  </div>
                )}

                {request.transaction_id && request.processed_date && (
                  <div className="flex justify-between items-start">
                    <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                      Transaction ID :
                    </span>
                    <span className="text-right text-gray-600 text-sm">
                      {request.transaction_id}
                    </span>
                  </div>
                )}

                {request.is_verified === false && request.rejection_reason && (
                  <div className="flex justify-between items-start border border-red-400 bg-red-100 p-2">
                    <span className="font-semibold min-w-[120px] text-red-600 text-sm">
                      Rejection Reason :
                    </span>
                    <span className="text-right text-red-600 text-sm">
                      {request.rejection_reason}
                    </span>
                  </div>
                )}

                {request.admin_comment && (
                  <div className="flex justify-between items-start">
                    <span className="font-semibold min-w-[120px] text-gray-800 text-sm">
                      Comment :
                    </span>
                    <span className="text-right text-gray-600 text-sm">
                      {request.admin_comment}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-1 flex items-center justify-center gap-5">
          {/* Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPrev || loading}
            className={`w-8 h-8 items-center justify-center border text-sm font-medium flex items-center gap-2 ${
              pagination.hasPrev && !loading
                ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            }`}
          >
            <ChevronLeft />
          </button>

          {/* Page Input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={currentPageInput}
              min={1}
              max={pagination.totalPages}
              onChange={handlePageInputChange}
              onKeyPress={handlePageInputSubmit}
              onBlur={handleInputBlur}
              className="h-8 border border-gray-300  text-center text-md"
              disabled={loading}
            />
            <span className="text-sm text-gray-600">
              / {pagination.totalPages}
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNext || loading}
            className={`w-8 h-8 border items-center justify-center  text-sm font-medium flex items-center gap-2 ${
              pagination.hasNext && !loading
                ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            }`}
          >
            <ChevronRight
              className="w-4 h-4"
              style={{
                width: "1rem",
                height: "1rem",
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardPaymentRequest;
