"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { Mail, Lock, User, Loader, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    showMessage(null);

    try {
      const res = await fetch(`${apiUrl}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.status) {
        showMessage("Login successful!", "success");
        console.log("Login complete data = ", data);

        Cookies.set("auth_token", data.token, { expires: 7, secure: true });
        localStorage.setItem("user", JSON.stringify(data.user));

        router.push("/");
      } else {
        showMessage(data.message || "Login failed", "error");
      }
    } catch (err) {
      showMessage("Server error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4"
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
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-primary-soft)" }}
            >
              <User
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
                Login
              </h1>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Welcome back to your account
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-text-primary)" }}
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
                  className="w-full pl-10 pr-3 py-2 border focus:ring-2 focus:outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                    "--tw-border-opacity": "1",
                  }}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <input
                  type="password"
                  name="password"
                  className="w-full pl-10 pr-3 py-2 border focus:ring-2 focus:outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    borderColor: "var(--color-border)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/resetpassword"
                className="text-sm hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Reset password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors hover:opacity-90"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
              }}
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 text-sm flex items-center gap-2 border`}
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
                <div
                  className="h-4 w-4 border flex items-center justify-center"
                  style={{ borderColor: "currentColor" }}
                >
                  <span className="text-xs">!</span>
                </div>
              )}
              {message}
            </div>
          )}
        </div>

        <div
          className="p-4 text-center text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Don't have an account?{" "}
          <Link
            href="/register"
            className="hover:underline font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
