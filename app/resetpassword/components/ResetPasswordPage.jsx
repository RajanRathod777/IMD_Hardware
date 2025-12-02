"use client";
import { useState, useEffect } from "react";
import { Mail, Lock, Loader, CheckCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [token, setToken] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const [otpSent, setOtpSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Countdown timers
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(
      () => setResendCooldown((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(t);
  }, [resendCooldown]);

  // Helper to show messages
  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 6000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/check/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.status) {
        setToken(data.token);
        setCountdown(300); // 10 minutes
        setResendCooldown(300); // 1 minute cooldown
        setOtpSent(true);
        showMessage("OTP sent to your email", "success");
      } else {
        showMessage(data.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      showMessage("Server error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    await handleSendOtp();
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    if (!token || countdown <= 0) {
      showMessage("OTP expired. Please resend.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });
      const data = await res.json();
      if (data.status) {
        showMessage("Password reset successful!", "success");
        setResetSuccess(true);
        // Reset form
        setFormData({
          email: "",
          otp: "",
          newPassword: "",
          confirmPassword: "",
        });
        setToken(null);
        setCountdown(0);
        setResendCooldown(0);
        setOtpSent(false);
      } else {
        showMessage(data.message || "Failed to reset password", "error");
      }
    } catch (err) {
      showMessage("Server error while resetting password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Reset success view
  if (resetSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-8 px-4"
        style={{
          backgroundColor: "var(--color-bg)",
          fontFamily: "var(--font-primary)",
        }}
      >
        <div
          className="max-w-md w-full shadow-sm border p-6 text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <CheckCircle
            className="h-16 w-16 mx-auto mb-4"
            style={{ color: "var(--color-success)" }}
          />
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Password Reset Successful!
          </h3>
          <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
            You can now login with your new password.
          </p>
          <Link
            href="/login"
            className="w-full py-2 px-4 transition-colors flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4"
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-primary)",
      }}
    >
      <div
        className="max-w-md w-full shadow-sm border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <h1
          className="text-xl font-semibold mb-4 flex items-center gap-2"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          <Lock className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
          Reset Password
        </h1>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 text-sm flex items-center gap-2 border`}
            style={{
              backgroundColor:
                messageType === "success"
                  ? "var(--color-success-light)"
                  : "var(--color-danger-light)",
              borderColor:
                messageType === "success"
                  ? "var(--color-success)"
                  : "var(--color-danger)",
              color:
                messageType === "success"
                  ? "var(--color-success)"
                  : "var(--color-danger)",
            }}
          >
            {messageType === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center text-xs">
                !
              </div>
            )}
            {message}
          </div>
        )}

        <form
          onSubmit={otpSent ? handleResetPassword : handleSendOtp}
          className="space-y-4"
        >
          {/* Email Input - Always visible */}
          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--color-text-muted)" }}
              />
              <input
                type="email"
                name="email"
                className="w-full pl-10 pr-3 py-2 px-2 border focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  borderColor: "var(--color-border)",
                  "--tw-ring-color": "var(--color-primary)",
                }}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={otpSent}
              />
            </div>
          </div>

          {/* OTP Section - Only show after OTP is sent */}
          {otpSent && (
            <>
              <div
                className="mb-2 text-sm flex items-center justify-between"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span>OTP sent to {formData.email}</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className="text-sm disabled:opacity-50 flex items-center gap-1 hover:opacity-80"
                  style={{ color: "var(--color-primary)" }}
                >
                  <RefreshCw className="h-4 w-4" />
                  {resendCooldown > 0 ? `${resendCooldown}s` : "Resend"}
                </button>
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  className="w-full py-2 px-2 border focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                />
                {countdown > 0 && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    OTP expires in: {formatTimer(countdown)}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type="password"
                    name="newPassword"
                    className="w-full pl-10 pr-3 py-2 px-2 border focus:ring-2 focus:outline-none"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text-primary)",
                      borderColor: "var(--color-border)",
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full pl-10 pr-3 py-2 px-2 border focus:ring-2 focus:outline-none"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text-primary)",
                      borderColor: "var(--color-border)",
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors`}
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
            }}
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : otpSent ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {loading
              ? otpSent
                ? "Resetting..."
                : "Sending OTP..."
              : otpSent
              ? "Reset Password"
              : "Send OTP"}
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
