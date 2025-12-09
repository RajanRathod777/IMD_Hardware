"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Flag,
  Building,
  Home,
  MapPinned,
  Loader,
  CheckCircle,
  Camera,
  X,
  Pencil,
  LogOut,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { states, cities } from "../../../data/indianStatesCities";

export default function ProfilePage() {
  const token = Cookies.get("auth_token");
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    phone_code: "",
    phone: "",
    state: "",
    country: "India",
    address: "",
    city: "",
    pincode: "",
    image: null,
  });
  const [email, setEmail] = useState("");
  const [point, setPoint] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const [userData, setUserData] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    // Load all states from local data
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

  const fetchUserProfile = async () => {
    if (!token) {
      showMessage("Please login first", "error");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/token/login`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.status && data.user) {
        setUserData(data.user);
        setFormData({
          username: data.user.username || "",
          phone_code: data.user.phone_code || "+91",
          phone: data.user.phone || "",
          state: data.user.state || "",
          country: data.user.country || "India",
          address: data.user.address || "",
          city: data.user.city || "",
          pincode: data.user.pincode || "",
          image: data.user.image || null,
        });

        setPoint(data.user.point);
        setEmail(data.user.email);
      }
    } catch (error) {
      showMessage("Failed to load profile", "error");
    }
  };

  // Logout function
  const handleLogout = () => {
    // Clear all cookies
    Cookies.remove("admin_token");

    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Show logout message
    showMessage("Logged out successfully", "success");

    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 6000);
  };

  const enableEdit = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate pincode to only allow 6 digits
    if (name === "pincode") {
      // Only allow digits and max 6 characters
      if (value && (!/^\d*$/.test(value) || value.length > 6)) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsEdited(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showMessage("Please select an image file", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showMessage("Image size should be less than 5MB", "error");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setIsEdited(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: userData.image,
    }));
    setPreviewImage("");
    setIsEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      showMessage("Please login first", "error");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add all fields explicitly with proper field names
      formDataToSend.append("username", formData.username || "");
      formDataToSend.append("phone_code", formData.phone_code || "+91");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("state", formData.state || "");
      formDataToSend.append("country", formData.country || "India");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("city", formData.city || "");
      formDataToSend.append("pincode", formData.pincode || "");

      // Handle image properly
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`${apiUrl}/api/v1/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it automatically
        },
        body: formDataToSend,
      });

      // Check if response is OK first
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status) {
        showMessage("Profile updated successfully!", "success");
        setIsEdited(false);
        setEditableFields({});
        fetchUserProfile();
      } else {
        showMessage(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showMessage(error.message || "Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Improved Helper to get correct image URL ---
  const getProfileImageSrc = () => {
    if (previewImage) return previewImage;

    if (formData.image instanceof File) {
      return URL.createObjectURL(formData.image);
    }

    if (
      Array.isArray(formData.image) &&
      formData.image.length > 0 &&
      formData.image[0]
    ) {
      return `${apiUrl}/image/users/${formData.image[0]}`;
    }

    if (typeof formData.image === "string") {
      return `${apiUrl}/image/users/${formData.image}`;
    }

    return null;
  };

  const profileImageSrc = getProfileImageSrc();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-primary)",
      }}
    >
      <div className="flex items-center justify-center">
        <div
          className=" h-[calc(100vh-120px)] max-[1035px]:h-[calc(100vh-230px)] overflow-y-auto max-w-md w-full shadow-sm border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          {/* Header */}
          <div
            className="p-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex justify-between items-center gap-3">
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
                    Profile Information
                  </h1>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Update your personal details
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex justify-center items-center gap-2 text-white p-2 hover:opacity-90 transition-colors"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 ">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Image */}
              <div className="flex gap-3 ">
                <div className="relative">
                  <div
                    className="w-24 h-24 border overflow-hidden"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {profileImageSrc ? (
                      <img
                        src={profileImageSrc}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        className="w-full h-full p-4"
                        style={{ color: "var(--color-text-muted)" }}
                      />
                    )}
                  </div>

                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 text-white p-2 shadow-lg cursor-pointer hover:opacity-90 transition-colors"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {profileImageSrc && previewImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 text-white p-1 shadow-lg hover:opacity-90 transition-colors"
                      style={{ backgroundColor: "var(--color-danger)" }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Email Address
                  </label>
                  <div
                    className="flex gap-2 alin-center "
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    <Mail
                      className="w-4"
                      style={{ color: "var(--color-text-muted)" }}
                    />
                    {email}
                  </div>

                  <label
                    className="block text-sm mt-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    point
                  </label>
                  <div
                    className="flex gap-2 "
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    <Coins
                      className="w-4"
                      style={{ color: "var(--color-text-muted)" }}
                    />
                    {point}
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4">
                <div
                  className="flex items-center gap-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Personal Information
                  </span>
                </div>

                {/* Username and Email */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: "var(--color-text-muted)" }}
                      />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        readOnly={!editableFields.username}
                        className={`w-full pl-10 pr-10 py-2 border focus:ring-2 focus:outline-none ${
                          !editableFields.username ? "cursor-not-allowed" : ""
                        }`}
                        style={{
                          backgroundColor: !editableFields.username
                            ? "var(--color-surface-alt)"
                            : "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          borderColor: "var(--color-border)",
                          "--tw-ring-color": "var(--color-primary)",
                        }}
                        placeholder="Enter username"
                      />
                      {!editableFields.username && (
                        <button
                          type="button"
                          onClick={() => enableEdit("username")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div
                className="space-y-4 pt-4 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Contact Information
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-24">
                        <Flag
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                          style={{ color: "var(--color-text-muted)" }}
                        />
                        <select
                          name="phone_code"
                          value={formData.phone_code}
                          onChange={handleInputChange}
                          disabled={!editableFields.phone_code}
                          className={`w-full pl-10 pr-3 py-2 border ${
                            !editableFields.phone_code
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                          style={{
                            backgroundColor: !editableFields.phone_code
                              ? "var(--color-surface-alt)"
                              : "var(--color-surface)",
                            color: "var(--color-text-primary)",
                            borderColor: "var(--color-border)",
                          }}
                        >
                          <option value="+91">+91</option>
                        </select>
                        {!editableFields.phone_code && (
                          <button
                            type="button"
                            onClick={() => enableEdit("phone_code")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <Phone
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                          style={{ color: "var(--color-text-muted)" }}
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          readOnly={!editableFields.phone}
                          className={`w-full pl-10 pr-10 py-2 border focus:ring-2 focus:outline-none ${
                            !editableFields.phone ? "cursor-not-allowed" : ""
                          }`}
                          style={{
                            backgroundColor: !editableFields.phone
                              ? "var(--color-surface-alt)"
                              : "var(--color-surface)",
                            color: "var(--color-text-primary)",
                            borderColor: "var(--color-border)",
                            "--tw-ring-color": "var(--color-primary)",
                          }}
                          placeholder="Phone number"
                        />
                        {!editableFields.phone && (
                          <button
                            type="button"
                            onClick={() => enableEdit("phone")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div
                className="space-y-4 pt-4 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Address Information
                  </span>
                </div>

                <div>
                  <label
                    className="block text-sm mb-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Address
                  </label>
                  <div className="relative">
                    <Home
                      className="absolute left-3 top-3 h-4 w-4"
                      style={{ color: "var(--color-text-muted)" }}
                    />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      readOnly={!editableFields.address}
                      rows="2"
                      className={`w-full pl-10 pr-10 py-2 border focus:ring-2 focus:outline-none resize-none ${
                        !editableFields.address ? "cursor-not-allowed" : ""
                      }`}
                      style={{
                        backgroundColor: !editableFields.address
                          ? "var(--color-surface-alt)"
                          : "var(--color-surface)",
                        color: "var(--color-text-primary)",
                        borderColor: "var(--color-border)",
                        "--tw-ring-color": "var(--color-primary)",
                      }}
                      placeholder="Enter your full address"
                    />
                    {!editableFields.address && (
                      <button
                        type="button"
                        onClick={() => enableEdit("address")}
                        className="absolute right-3 top-3 hover:opacity-80"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Country
                    </label>
                    <div className="relative">
                      <Flag
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: "var(--color-text-muted)" }}
                      />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={!editableFields.country}
                        className={`w-full pl-10 pr-10 py-2 border ${
                          !editableFields.country ? "cursor-not-allowed" : ""
                        }`}
                        style={{
                          backgroundColor: !editableFields.country
                            ? "var(--color-surface-alt)"
                            : "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <option value="India">India</option>
                      </select>
                      {!editableFields.country && (
                        <button
                          type="button"
                          onClick={() => enableEdit("country")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      State
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: "var(--color-text-muted)" }}
                      />
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!editableFields.state}
                        className={`w-full pl-10 pr-10 py-2 border ${
                          !editableFields.state ? "cursor-not-allowed" : ""
                        }`}
                        style={{
                          backgroundColor: !editableFields.state
                            ? "var(--color-surface-alt)"
                            : "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <option value="">Select State</option>
                        {stateOptions.map((s) => (
                          <option key={s.isoCode} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {!editableFields.state && (
                        <button
                          type="button"
                          onClick={() => enableEdit("state")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      City
                    </label>
                    <div className="relative">
                      <Building
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: "var(--color-text-muted)" }}
                      />
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!editableFields.city || !formData.state}
                        className={`w-full pl-10 pr-10 py-2 border ${
                          !editableFields.city || !formData.state
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            !editableFields.city || !formData.state
                              ? "var(--color-surface-alt)"
                              : "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <option value="">Select City</option>
                        {cityOptions.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {!editableFields.city && (
                        <button
                          type="button"
                          onClick={() => enableEdit("city")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Pincode (6 digits)
                    </label>
                    <div className="relative">
                      <MapPinned
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: "var(--color-text-muted)" }}
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        readOnly={!editableFields.pincode}
                        maxLength="6"
                        pattern="\d{6}"
                        className={`w-full pl-10 pr-10 py-2 border focus:ring-2 focus:outline-none ${
                          !editableFields.pincode ? "cursor-not-allowed" : ""
                        }`}
                        style={{
                          backgroundColor: !editableFields.pincode
                            ? "var(--color-surface-alt)"
                            : "var(--color-surface)",
                          color: "var(--color-text-primary)",
                          borderColor: "var(--color-border)",
                          "--tw-ring-color": "var(--color-primary)",
                        }}
                        placeholder="Enter 6-digit pincode"
                      />
                      {!editableFields.pincode && (
                        <button
                          type="button"
                          onClick={() => enableEdit("pincode")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={isEdited ? "pt-4 border-t space-y-3" : ""}
                style={{ borderColor: "var(--color-border)" }}
              >
                {isEdited && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white py-2 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {loading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {loading ? "Updating Profile..." : "Update Profile"}
                  </button>
                )}
              </div>
              <div
                className="p-2 text-center text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Update Password{" "}
                <Link
                  href="/updatepassword"
                  className="hover:underline font-medium"
                  style={{ color: "var(--color-primary)" }}
                >
                  Update Password
                </Link>
              </div>
            </form>
            {/* Message */}
            {message && (
              <div
                className={`mb-4 p-3 text-sm border`}
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  borderColor: "var(--color-border)",
                }}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
