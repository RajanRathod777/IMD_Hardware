"use client";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactInfo = () => {
  const contactMethods = [
    { icon: Phone, title: "Phone Support", details: "+1 (555) 123-4567" },
    { icon: Mail, title: "Email Us", details: "support@imdhardware.com" },
    {
      icon: MapPin,
      title: "Visit Our Showroom",
      details: "123 Hardware Street, Industrial Park",
    },
  ];

  return (
    <section
      className="mb-24 py-16 border-y"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        borderColor: "var(--color-border-light)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-center mb-12"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Get In Touch
        </h2>
        <div
          className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x"
          style={{ borderColor: "var(--color-border-light)" }}
        >
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} className="flex flex-col items-center p-8">
                <IconComponent
                  className="w-8 h-8 mb-4"
                  style={{ color: "var(--color-primary)" }}
                />
                <h3
                  className="font-bold text-lg mb-2"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {method.title}
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {method.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
