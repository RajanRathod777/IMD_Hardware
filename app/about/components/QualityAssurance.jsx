"use client";
import { Shield, Wrench, Package, Truck } from "lucide-react";

const QualityAssurance = () => {
  const qualityFeatures = [
    {
      icon: Shield,
      title: "Raw Material Check",
      description: "Premium material selection",
    },
    {
      icon: Wrench,
      title: "Performance Testing",
      description: "Rigorous durability tests",
    },
    {
      icon: Package,
      title: "Safety Certification",
      description: "International standards",
    },
    {
      icon: Truck,
      title: "Packaging Quality",
      description: "Secure delivery guaranteed",
    },
  ];

  return (
    <section
      className="mb-24 p-12 border-y"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        borderColor: "var(--color-border-light)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-3xl font-bold text-center mb-12"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Quality Assurance Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {qualityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="p-8 text-center bg-white border hover:border-[var(--color-primary)] transition-colors duration-300"
                style={{ borderColor: "transparent" }}
              >
                <div className="flex justify-center mb-6">
                  <IconComponent
                    className="w-12 h-12"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <h3
                  className="font-bold text-lg mb-3"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QualityAssurance;
