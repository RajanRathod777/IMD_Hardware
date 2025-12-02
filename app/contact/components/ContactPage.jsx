"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HeadphonesIcon,
} from "lucide-react";
import Cookies from "js-cookie";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 9427893121",
      description: "Mon to Fri from 9am to 6pm",
      color: "bg-gray-100 text-black",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "imd@imdhardware.com",
      description: "Send us your query anytime!",
      color: "bg-gray-100 text-black",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Near Vaikunthdham Temple, Himatnagar Shamlaji Road, NH 08",
      description: "Dist.Sabarkantha. Gujarat-383001 , India",
      color: "bg-gray-100 text-black",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 - 18:00",
      description: "Saturday: 10:00 - 16:00",
      color: "bg-gray-100 text-black",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");

    try {
      const token = Cookies.get("auth_token");
      if (!token) {
        setSubmitStatus("error");
        setSubmitMessage("Please log in to send a message");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
      const response = await fetch(`${apiUrl}/api/v1/contact/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage(data.message || "Message sent successfully!");
        setFormData({
          subject: "",
          email: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          data.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage("");
      }, 20000);
    }
  };

  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer 30-day returns for unused items in original packaging. Return shipping is free.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location.",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-primary)",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <h2
          className="text-2xl font-bold mb-8"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Contact Information
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Contact Methods */}
              <div className="space-y-3 mb-3">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 shadow-sm border"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <div
                      className={`p-3`}
                      style={{
                        backgroundColor: "var(--color-surface-alt)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      <method.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {method.title}
                      </h3>
                      <p
                        className="font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {method.details}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div
                className="p-6 shadow-sm border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  {[
                    {
                      icon: Facebook,
                      label: "Facebook",
                    },
                    {
                      icon: Twitter,
                      label: "Twitter",
                    },
                    {
                      icon: Instagram,
                      label: "Instagram",
                    },
                    {
                      icon: Linkedin,
                      label: "LinkedIn",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`p-3 transition-colors`}
                      style={{
                        backgroundColor: "var(--color-surface-alt)",
                        color: "var(--color-text-primary)",
                      }}
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div
              className="shadow-sm border p-8"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="p-2"
                  style={{ backgroundColor: "var(--color-surface-alt)" }}
                >
                  <MessageCircle
                    className="h-6 w-6"
                    style={{ color: "var(--color-text-primary)" }}
                  />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Send us a Message
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className="w-full px-4 py-3 border focus:ring-2 transition-colors focus:outline-none"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-primary)",
                        "--tw-ring-color": "var(--color-primary)",
                      }}
                      placeholder="What is this regarding?"
                    />
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {formData.subject.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border focus:ring-2 transition-colors focus:outline-none"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-primary)",
                        "--tw-ring-color": "var(--color-primary)",
                      }}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    rows={6}
                    className="w-full px-4 py-3 border focus:ring-2 transition-colors resize-vertical focus:outline-none"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-primary)",
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                    placeholder="Please describe your inquiry in detail..."
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {formData.message.length}/1000 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 focus:ring-2 focus:ring-offset-2 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-on-primary)",
                    "--tw-ring-color": "var(--color-primary)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p
                  className="text-center text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  By submitting this form, you agree to our{" "}
                  <a
                    href="#"
                    className="underline hover:opacity-80"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    privacy policy
                  </a>
                </p>
              </form>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div
                  className="mb-6 mt-6 p-4 border flex items-center gap-3"
                  style={{
                    backgroundColor: "var(--color-success-light)",
                    borderColor: "var(--color-success)",
                  }}
                >
                  <CheckCircle
                    className="h-5 w-5"
                    style={{ color: "var(--color-success)" }}
                  />
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: "var(--color-success)" }}
                    >
                      Message sent successfully!
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {submitMessage}
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div
                  className="mb-6 mt-6 p-4 border flex items-center gap-3"
                  style={{
                    backgroundColor: "var(--color-danger-light)",
                    borderColor: "var(--color-danger)",
                  }}
                >
                  <AlertCircle
                    className="h-5 w-5"
                    style={{ color: "var(--color-danger)" }}
                  />
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: "var(--color-danger)" }}
                    >
                      Failed to send message
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {submitMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div
        className="border-t"
        style={{
          backgroundColor: "var(--color-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-bold mb-4"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Visit Our Store
            </h2>
          </div>

          <div
            className="h-96"
            style={{ backgroundColor: "var(--color-surface-alt)" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.6375157306334!2d72.969495!3d23.5814588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395db9001f0e723b%3A0x2bf46589444fadb9!2sIMD%20Hardware!5e0!3m2!1sen!2sin!4v1763225466726!5m2!1sen!2sin"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Parking
              </h3>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Free parking available in adjacent garage
              </p>
            </div>
            <div className="text-center">
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Accessibility
              </h3>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Wheelchair accessible with dedicated assistance
              </p>
            </div>
            <div className="text-center">
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Services
              </h3>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Personal shopping & product demonstrations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the missing ArrowRight component
const ArrowRight = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

export default ContactPage;
