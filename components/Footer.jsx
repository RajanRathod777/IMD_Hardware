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
  ShieldCheck,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ✅ Trust Badges Section */}
      <div className="p-2">
        <div className="mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1">
            {[
              {
                icon: (
                  <Truck
                    className="w-8 h-8 mb-3"
                    style={{ color: "var(--color-primary)" }}
                  />
                ),
                title: "Free Shipping",
                desc: "On orders above ₹999",
              },
              {
                icon: (
                  <Shield
                    className="w-8 h-8 mb-3"
                    style={{ color: "var(--color-primary)" }}
                  />
                ),
                title: "Quality Guarantee",
                desc: "30-Day Return Policy",
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
              {
                icon: (
                  <ShieldCheck
                    className="w-8 h-8 mb-3"
                    style={{ color: "var(--color-primary)" }}
                  />
                ),
                title: "Secure Payment",
                desc: "100% Secure Transactions",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg flex flex-col items-center justify-center p-6 "
                style={{
                  border: `1px solid var(--color-border-light)`,
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  ></div>
                  {item.icon}
                </div>
                <h3
                  className="font-semibold text-lg mb-1 text-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm text-center"
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
      <div className="m-1 px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* 1. Company Info */}
          <div className="flex flex-col space-y-4">
            <div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-text-primary)",
                }}
              >
                IMD Hardware
              </h3>
              <p
                className="text-sm mb-1 opacity-60"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Your Trusted Hardware Partner
              </p>
            </div>
            <p
              className="leading-relaxed text-sm mb-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Providing high-quality hardware solutions with fast delivery and
              excellent customer service across Gujarat since 2010.
            </p>
            <div className="flex space-x-3 mt-2">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="p-2.5 transition-all duration-300 rounded-lg hover:-translate-y-1 hover:shadow-md group/social"
                  style={{
                    border: `1px solid var(--color-border-light)`,
                    backgroundColor: "var(--color-surface-alt)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Icon className="w-4 h-4 group-hover/social:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4
              className="text-lg font-semibold mb-6 pb-2 relative inline-block"
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
                { to: "/about", label: "About Us" },
                { to: "/rewards", label: "Rewards" },
                { to: "/contact", label: "Contact Us" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.to}
                    className={`flex items-center gap-2 group transition-all text-sm py-1.5
              ${
                pathname === item.to
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)]"
              }
            `}
                  >
                    <span className="hover:text-[var(--color-primary)]">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Consumer Policy */}
          <div>
            <h4
              className="text-lg font-semibold mb-6 pb-2 relative inline-block"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-primary)",
              }}
            >
              Policies
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Terms of Service", to: "/terms-conditions" },
                { label: "Return Policy", to: "/return-policy" },
                { label: "Shipping Policy", to: "/shipping-policy" },
                { label: "Cancellation Policy", to: "/cancellation-policy" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.to}
                    className={`flex items-center gap-2 group transition-all text-sm py-1.5 ${
                      pathname === item.to
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    <span className="hover:text-[var(--color-primary)]">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h4
              className="text-lg font-semibold mb-6 pb-2 relative inline-block"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-primary)",
              }}
            >
              Contact Us
            </h4>
            <div
              className="space-y-4 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <div className="flex items-start group">
                <div className="p-2 rounded-lg mr-3 transition-colors duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10">
                  <MapPin
                    className="w-4 h-4"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <div>
                  <p
                    className="font-medium mb-1"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Address
                  </p>
                  <p className="leading-relaxed opacity-80">
                    Near Vaikunthdham Temple, Himatnagar Shamlaji Road, NH 08,
                    Dist.Sabarkantha. Gujarat-383001
                  </p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="p-2 rounded-lg mr-3 transition-colors duration-300 group-hover:bg-green-50 dark:group-hover:bg-green-900/10">
                  <Phone
                    className="w-4 h-4"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <div>
                  <p
                    className="font-medium mb-1"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Phone
                  </p>
                  <a
                    href="tel:+919427893121"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300 hover:underline"
                  >
                    +91 9427893121
                  </a>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="p-2 rounded-lg mr-3 transition-colors duration-300 group-hover:bg-red-50 dark:group-hover:bg-red-900/10">
                  <Mail
                    className="w-4 h-4"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <div>
                  <p
                    className="font-medium mb-1"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:imd@imdhardware.com"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300 hover:underline"
                  >
                    imd@imdhardware.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Footer */}
      <div className="m-1">
        <div
          className="px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
          style={{ borderColor: "var(--color-border-light)" }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck
              className="w-4 h-4"
              style={{ color: "var(--color-primary)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              © {new Date().getFullYear()} IMD Hardware. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span
              className="text-xs opacity-70"
              style={{ color: "var(--color-text-secondary)" }}
            >
              GSTIN: 24BPYPR7738J1ZU
            </span>
            <div className="flex items-center gap-4">
              <img
                src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
                alt="Visa"
                className="h-6 w-auto opacity-70"
              />
              <img
                src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
                alt="Mastercard"
                className="h-6 w-auto opacity-70"
              />
              <img
                src="https://cdn-icons-png.flaticon.com/128/825/825454.png"
                alt="UPI"
                className="h-6 w-auto opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
