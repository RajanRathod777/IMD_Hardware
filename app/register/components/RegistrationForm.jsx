"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Mail,
  Phone,
  User,
  Lock,
  MapPin,
  Home,
  Camera,
  CheckCircle,
  RefreshCw,
  Loader,
  X,
} from "lucide-react";
import Link from "next/link";
import { states, cities } from "../../../data/indianStatesCities";

export default function RegistrationPage() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const pinCode_url = process.env.NEXT_PUBLIC_PINCODE_URL;

  const [stage, setStage] = useState("verify"); // verify | register | done

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneCode: "+91",
    state: "",
    country: "India",
    address: "",
    city: "",
    pincode: "",
    otp: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [token, setToken] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const [verified, setVerified] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Load all states from local data
  useEffect(() => {
    setStateOptions(states);
  }, []);

  // When state changes, load cities from local data
  useEffect(() => {
    if (!formData.state) {
      setCityOptions([]);
      return;
    }

    const selectedState = states.find((s) => s.name === formData.state);
    if (selectedState) {
      const stateCities = cities[selectedState.isoCode];
      if (Array.isArray(stateCities)) {
        setCityOptions(stateCities);
      } else {
        setCityOptions([]);
      }
    }
  }, [formData.state]);

  // Fetch pincode when city changes
  useEffect(() => {
    const fetchPincode = async () => {
      if (!formData.city) return;

      try {
        const response = await fetch(`${pinCode_url}/${formData.city}`);
        const data = await response.json();
        const firstItem = data[0];
        if (firstItem?.Status === "Success") {
          const firstPin = firstItem.PostOffice[0].Pincode;
          setFormData((prev) => ({ ...prev, pincode: firstPin }));
        } else {
          setFormData((prev) => ({ ...prev, pincode: "Not found" }));
        }
      } catch (error) {
        console.error("Error fetching pin code:", error);
        setFormData((prev) => ({ ...prev, pincode: "Error" }));
      }
    };

    fetchPincode();
  }, [formData.city]);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showMessage("Please select a valid image file", "error");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showMessage("Image size should be less than 5MB", "error");
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  // countdown for token validity
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  // resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(
      () => setResendCooldown((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(t);
  }, [resendCooldown]);

  // helper message function
  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 20000);
  };

  // input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // send email/phone verification
  const handleVerify = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    showMessage(null);
    try {
      const res = await fetch(`${apiUrl}/api/v1/email-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
        }),
      });
      const data = await res.json();

      if (data.status) {
        setToken(data.token);
        setCountdown(300);
        setResendCooldown(300);
        setVerified(true);
        showMessage(data.message || "OTP sent successfully", "success");
      } else {
        showMessage(data.message || "Verification failed", "error");
      }
    } catch (err) {
      showMessage("Server error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await handleVerify();
  };

  // final registration
  const handleRegister = async (e) => {
    e && e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    if (!token || countdown <= 0) {
      showMessage("Token expired. Please verify again.", "error");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("phone_code", formData.phoneCode.replace("+", ""));
      form.append("phone", formData.phone);
      form.append("state", formData.state);
      form.append("country", formData.country);
      form.append("address", formData.address);
      form.append("city", formData.city);
      form.append("pincode", formData.pincode);
      form.append("otp", formData.otp);
      if (image) form.append("image", image, image.name);

      const res = await fetch(`${apiUrl}/api/v1/registration`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();

      if (data.status) {
        showMessage("Registration successful!", "success");
        Cookies.set("auth_token", data.token, { expires: 7, secure: true });
        localStorage.setItem("user", JSON.stringify(data.user));
        setStage("done");
      } else {
        showMessage(data.message || "Registration failed", "error");
      }
    } catch (err) {
      showMessage("Server error while registering.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8 px-4">
      <div className="max-w-md w-full bg-white shadow-sm border border-gray-300">
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
              <User className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-black">
                Create Account
              </h1>
              <p className="text-sm text-gray-600">
                Join us in just a few steps
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {verified && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-black" />
                <span className="text-sm text-black">Verified</span>
                <span className="text-xs text-gray-600">
                  ({formatTimer(countdown)})
                </span>
              </div>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-xs text-black hover:text-gray-700 disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                {resendCooldown > 0 ? `${resendCooldown}s` : "Resend"}
              </button>
            </div>
          )}

          <form
            onSubmit={verified ? handleRegister : handleVerify}
            className="space-y-4"
          >
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-black">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Contact Information</span>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={verified}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="relative w-24">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="phoneCode"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300"
                      value={formData.phoneCode}
                      onChange={handleInputChange}
                      disabled={verified}
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className="flex-1 py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={verified}
                  />
                </div>
              </div>

              {!verified && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-2 hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {loading ? "Sending OTP..." : "Send Verification OTP"}
                </button>
              )}
            </div>

            {/* Account + Personal Info */}
            {verified && (
              <>
                {/* Account Details */}
                <div className="space-y-4 pt-4 border-t border-gray-300">
                  <div className="flex items-center gap-2 text-black">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Account Details</span>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Choose username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      name="otp"
                      className="w-full py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="w-full py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Profile Image (optional)
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4 relative inline-block">
                        <div className="mt-4 w-24 h-24 border border-gray-300 overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1 -right-2 bg-black text-white p-1 hover:bg-gray-800 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {/* File Input */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full py-1 text-sm opacity-0 absolute z-10 cursor-pointer"
                        id="profile-image"
                      />
                      <div className="border border-gray-300 p-2 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Camera className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                        <span className="text-sm text-gray-600">
                          {image ? "Change Image" : "Choose Profile Image"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG, JPEG Max size: 5MB
                    </p>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4 pt-4 border-t border-gray-300">
                  <div className="flex items-center gap-2 text-black">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Personal Information
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="w-full py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="Your address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                      >
                        <option value="India">India</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        City
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
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
                      <label className="block text-sm text-gray-600 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        className="w-full py-2 px-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-2 hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </>
            )}
          </form>

          {message && (
            <div
              className={`mt-4 p-3 text-sm border ${
                messageType === "success"
                  ? "bg-gray-100 text-black border-gray-300"
                  : messageType === "error"
                  ? "bg-gray-100 text-black border-gray-300"
                  : "bg-gray-100 text-black border-gray-300"
              }`}
            >
              {message}
            </div>
          )}

          <div className="p-4 text-center text-xs text-gray-500">
            All ready have an account?{" "}
            <Link href="/login" className="text-black hover:text-gray-700">
              login
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
