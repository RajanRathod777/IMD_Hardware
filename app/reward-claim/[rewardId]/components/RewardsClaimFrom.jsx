"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  Gift,
  Star,
  DollarSign,
  Code,
} from "lucide-react";

const RewardsClaimFrom = () => {
  const router = useRouter();
  const params = useParams();
  const rewardId = params?.rewardId;
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const token = Cookies.get("auth_token");

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rewardDetails, setRewardDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // Form states
  const [formData, setFormData] = useState({
    upi_id: "",
    account_holder_name: "",
    bank_name: "",
    bank_IFC_code: "",
    account_number: "",
  });

  // Fetch reward details by ID
  useEffect(() => {
    const fetchRewardDetails = async () => {
      try {
        setFetchLoading(true);
        setError("");

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          `${apiUrl}/api/v1/reward/get/by/${rewardId}?page=1&limit=10`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status) {
          setRewardDetails(result.reward);
        } else {
          throw new Error(result.message || "Failed to fetch reward details");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching reward:", err);
      } finally {
        setFetchLoading(false);
      }
    };

    if (rewardId) {
      fetchRewardDetails();
    } else {
      setError("No reward ID provided");
      setFetchLoading(false);
    }
  }, [rewardId, token, apiUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare payment info based on selected method
      let payment_info = {};

      if (paymentMethod === "UPI") {
        if (!formData.upi_id) {
          throw new Error("UPI ID is required");
        }
        payment_info = { upi_id: formData.upi_id };
      } else if (paymentMethod === "BankTransfer") {
        if (
          !formData.account_holder_name ||
          !formData.bank_name ||
          !formData.bank_IFC_code ||
          !formData.account_number
        ) {
          throw new Error("All bank details are required");
        }
        payment_info = {
          account_holder_name: formData.account_holder_name,
          bank_name: formData.bank_name,
          bank_IFC_code: formData.bank_IFC_code,
          account_number: formData.account_number,
        };
      }

      const requestBody = {
        reward_id: parseInt(rewardId),
        payment_method: paymentMethod,
        payment_info: payment_info,
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: "follow",
      };

      const response = await fetch(
        `${apiUrl}/api/v1/reward-payment-request/user/create`,
        requestOptions
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Request failed");
      }

      if (result.status) {
        setSuccess(
          result.message || "Reward payment request created successfully!"
        );
        // Reset form
        setFormData({
          upi_id: "",
          account_holder_name: "",
          bank_name: "",
          bank_IFC_code: "",
          account_number: "",
        });
        // Redirect after success
        setTimeout(() => {
          router.push("/rewards");
        }, 3000);
      } else {
        throw new Error(result.message || "Failed to create payment request");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/rewards");
  };

  // Loading state for reward fetch
  if (fetchLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader2
              className="w-8 h-8 animate-spin mx-auto mb-3"
              style={{ color: "var(--color-text-primary)" }}
            />
            <p className="text-gray-600">Loading reward details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state for reward fetch
  if (error && !rewardDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--color-text-primary)" }}
            />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              Error Loading Reward
            </h2>
            <p className="mb-4" style={{ color: "var(--color-text-primary)" }}>
              {error}
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 transition-colors"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
              }}
            >
              Back to Rewards
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center mr-4 transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Rewards
        </button>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Claim Reward
        </h1>
      </div>

      {/* Reward Details Card */}
      {rewardDetails && (
        <div
          className="shadow-sm border p-6 mb-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center mb-4">
            <Gift
              className="w-6 h-6 mr-3"
              style={{ color: "var(--color-text-primary)" }}
            />
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {rewardDetails.title}
            </h2>
          </div>

          <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
            {rewardDetails.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Reward Code */}
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ backgroundColor: "var(--color-bg-alt)" }}
            >
              <div className="flex items-center">
                <Code
                  className="w-4 h-4 mr-2"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Code:
                </span>
              </div>
              <code
                className="px-2 py-1 text-sm font-mono border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                {rewardDetails.reward_code}
              </code>
            </div>

            {/* Points Required */}
            <div
              className="flex items-center justify-center px-3 py-2"
              style={{ backgroundColor: "var(--color-bg-alt)" }}
            >
              <Star
                className="w-4 h-4 mr-2"
                style={{ color: "var(--color-text-secondary)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {rewardDetails.point} pts required
              </span>
            </div>

            {/* Cash Value */}
            <div
              className="flex items-center justify-center px-3 py-2"
              style={{ backgroundColor: "var(--color-bg-alt)" }}
            >
              <DollarSign
                className="w-4 h-4 mr-2"
                style={{ color: "var(--color-text-secondary)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                ₹{rewardDetails.money}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="border p-4 mb-6"
          style={{
            backgroundColor: "var(--color-bg-alt)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center">
            <AlertCircle
              className="w-5 h-5 mr-2"
              style={{ color: "var(--color-text-primary)" }}
            />
            <span
              className="font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Error: {error}
            </span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          className="border p-4 mb-6"
          style={{
            backgroundColor: "var(--color-bg-alt)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center">
            <CheckCircle
              className="w-5 h-5 mr-2"
              style={{ color: "var(--color-text-primary)" }}
            />
            <span
              className="font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {success}
            </span>
          </div>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Redirecting to rewards page...
          </p>
        </div>
      )}

      {/* Claim Form - Only show if not successful and reward exists */}
      {!success && rewardDetails && (
        <div
          className="shadow-sm border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Payment Information
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Select Payment Method
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4 focus:ring-2"
                    style={{
                      color: "var(--color-primary)",
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                  />
                  <span style={{ color: "var(--color-text-primary)" }}>
                    UPI Payment
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BankTransfer"
                    checked={paymentMethod === "BankTransfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4 focus:ring-2"
                    style={{
                      color: "var(--color-primary)",
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                  />
                  <span style={{ color: "var(--color-text-primary)" }}>
                    Bank Transfer
                  </span>
                </label>
              </div>
            </div>

            {/* UPI Form */}
            {paymentMethod === "UPI" && (
              <div className="mb-6">
                <label
                  htmlFor="upi_id"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upi_id"
                  name="upi_id"
                  value={formData.upi_id}
                  onChange={handleInputChange}
                  placeholder="Enter your UPI ID (e.g., username@upi)"
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                  }}
                  required
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Enter your UPI ID to receive the payment
                </p>
              </div>
            )}

            {/* Bank Transfer Form */}
            {paymentMethod === "BankTransfer" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={handleInputChange}
                    placeholder="Enter account holder name as per bank records"
                    className="w-full px-3 py-2 border focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: "var(--color-border)",
                      "--tw-ring-color": "var(--color-primary)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text-primary)",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="bank_name"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bank_name"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    placeholder="Enter your bank name"
                    className="w-full px-3 py-2 border focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: "var(--color-border)",
                      "--tw-ring-color": "var(--color-primary)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text-primary)",
                    }}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bank_IFC_code"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      IFC Code
                    </label>
                    <input
                      type="text"
                      id="bank_IFC_code"
                      name="bank_IFC_code"
                      value={formData.bank_IFC_code}
                      onChange={handleInputChange}
                      placeholder="IFSC code"
                      className="w-full px-3 py-2 border focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        borderColor: "var(--color-border)",
                        "--tw-ring-color": "var(--color-primary)",
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text-primary)",
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="account_number"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="account_number"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                      placeholder="Account number"
                      className="w-full px-3 py-2 border focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        borderColor: "var(--color-border)",
                        "--tw-ring-color": "var(--color-primary)",
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text-primary)",
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing Claim...
                </>
              ) : (
                `Claim Reward - ₹${rewardDetails?.money}`
              )}
            </button>
          </form>
        </div>
      )}

      {/* Info Note */}
      {!success && (
        <div
          className="mt-4 text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          <p>
            Your reward will be processed within 24-48 hours after verification
          </p>
          <p className="mt-1">Required points: {rewardDetails?.point} pts</p>
        </div>
      )}
    </div>
  );
};

export default RewardsClaimFrom;
