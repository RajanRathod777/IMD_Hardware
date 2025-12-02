import React from "react";
import {
  Truck,
  Shield,
  CreditCard,
  Headphones,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ✅ Trust Badges Section */}
      <div className="m-1">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              {
                icon: (
                  <Truck
                    className="w-8 h-8 mb-3"
                    style={{ color: "var(--color-primary)" }}
                  />
                ),
                title: "Free Shipping",
                desc: "Any orders",
              },
              {
                icon: (
                  <Shield
                    className="w-8 h-8 mb-3"
                    style={{ color: "var(--color-primary)" }}
                  />
                ),
                title: "Quality Guarantee",
                desc: "Quality checked",
              },
              {
                icon: (
                  <Headphones
                    className="w-8 h-8 mb-3"
                    style={{ color: "var(--color-primary)" }}
                  />
                ),
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-6"
                style={{
                  border: `1px solid var(--color-border)`,
                  backgroundColor: "var(--color-surface)",
                }}
              >
                {item.icon}
                <h3
                  className="font-semibold text-lg mb-1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Main Footer Content */}
      <div
        className="m-1 px-8 py-8"
        style={{ border: `1px solid var(--color-border)` }}
      >
        <div className="space-y-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-1">
          {/* Company Info */}
          <div className=" mx-auto">
            <h3
              className="text-2xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-primary)",
              }}
            >
              IMD Hardware
            </h3>
            <p
              className="mb-6 leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Your trusted online shopping destination. We bring you quality
              products with fast delivery and excellent customer service.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 transition-colors duration-300"
                  style={{
                    border: `1px solid var(--color-border)`,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:mx-auto">
            <h4
              className="text-lg font-semibold mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-primary)",
              }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Products" },
                { to: "/about", label: "About" },
                { to: "/rewards", label: "Rewards" },
                { to: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.to}
                    className="flex items-center gap-2 group transition"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    ></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mx-auto">
            <h4
              className="text-lg font-semibold mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-primary)",
              }}
            >
              Contact Info
            </h4>
            <div
              className="space-y-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <div className="flex items-center">
                <div>
                  <MapPin
                    className="w-4 h-4 mr-3"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                </div>
                Near Vaikunthdham Temple, Himatnagar Shamlaji Road, NH 08,
                Dist.Sabarkantha. Gujarat-383001;
              </div>
              <div className="flex items-center">
                <Phone
                  className="w-4 h-4 mr-3"
                  style={{ color: "var(--color-text-muted)" }}
                />
                +91 9427893121
              </div>
              <div className="flex items-center">
                <Mail
                  className="w-4 h-4 mr-3"
                  style={{ color: "var(--color-text-muted)" }}
                />
                imd@imdhardware.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Footer */}
      <div
        className="m-1 p-1"
        style={{ border: `1px solid var(--color-border)` }}
      >
        <div className="px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            © {new Date().getFullYear()} IMD Hardware. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm transition-colors duration-300"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
