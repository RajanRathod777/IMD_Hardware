"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { Lock, Loader, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function UpdatePassword() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const token = Cookies.get("auth_token");
  const user =
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  const [formData, setFormData] = useState({
    email: user ? user.email : "",
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 6000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    showMessage(null);

    if (!token) {
      showMessage("Authentication token missing. Please login.", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/v1/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status) {
        showMessage("Password updated successfully!", "success");
        setFormData({ email: "", currentPassword: "", newPassword: "" });
      } else {
        showMessage(data.message || "Failed to update password", "error");
      }
    } catch (err) {
      showMessage("Server error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex  justify-center "
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-primary)",
      }}
    >
      <div
        className="max-w-md w-full shadow-sm border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-primary-soft)" }}
            >
              <Lock
                className="h-5 w-5"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div>
              <h1
                className="text-xl font-semibold"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Update Password
              </h1>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Change your account password
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Email
              </label>
              <span style={{ color: "var(--color-text-primary)" }}>
                {user && user.email}
              </span>
            </div>

            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current password"
                className="w-full pl-3 pr-3 py-2 border focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  borderColor: "var(--color-border)",
                  "--tw-ring-color": "var(--color-primary)",
                }}
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                className="w-full pl-3 pr-3 py-2 border focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  borderColor: "var(--color-border)",
                  "--tw-ring-color": "var(--color-primary)",
                }}
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
              }}
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          <div
            className="p-2 text-center text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Profile{" "}
            <Link
              href="/profile"
              className="hover:underline font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              Go to Profile
            </Link>
          </div>

          {message && (
            <div
              className={`mt-4 p-3 text-sm flex items-center gap-2 border`}
              style={{
                backgroundColor:
                  messageType === "success"
                    ? "var(--color-success-light)"
                    : "var(--color-bg)",
                borderColor:
                  messageType === "success"
                    ? "var(--color-success)"
                    : "var(--color-border)",
                color:
                  messageType === "success"
                    ? "var(--color-success)"
                    : "var(--color-text-primary)",
              }}
            >
              {messageType === "success" ? (
                <CheckCircle
                  className="h-4 w-4"
                  style={{ color: "var(--color-success)" }}
                />
              ) : (
                <div
                  className="h-4 w-4 border flex items-center justify-center rounded-full"
                  style={{ borderColor: "var(--color-text-primary)" }}
                >
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    !
                  </span>
                </div>
              )}
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
