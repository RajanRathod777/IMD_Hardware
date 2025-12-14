"use client";
import { Package, Shield, Wrench, Mail, Truck, Phone } from "lucide-react";

const CompanyFlow = () => {
  const companyFlow = [
    {
      step: 1,
      title: "Product Sourcing",
      description: "Direct partnerships with top manufacturers",
      icon: Package,
    },
    {
      step: 2,
      title: "Quality Check",
      description: "Rigorous testing and quality assurance",
      icon: Shield,
    },
    {
      step: 3,
      title: "Inventory Management",
      description: "Smart stock optimization",
      icon: Wrench,
    },
    {
      step: 4,
      title: "Customer Order",
      description: "Easy online ordering process",
      icon: Mail,
    },
    {
      step: 5,
      title: "Fast Shipping",
      description: "Quick and reliable delivery",
      icon: Truck,
    },
    {
      step: 6,
      title: "After-Sales Support",
      description: "Continuous customer service",
      icon: Phone,
    },
  ];

  return (
    <section className="mb-24">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-3xl font-bold text-center mb-16"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Our Business Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companyFlow.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.step}
                className="relative p-8 border hover:bg-gray-50 transition-colors bg-white group"
                style={{
                  borderColor: "var(--color-border-light)",
                }}
              >
                {/* Step number watermark */}
                <div
                  className="absolute top-0 right-0 text-9xl font-bold opacity-5 leading-none pointer-events-none select-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {step.step}
                </div>

                <div className="flex items-center mb-6 relative z-10">
                  <div
                    className="w-14 h-14 flex items-center justify-center mr-6 border-2"
                    style={{
                      borderColor: "var(--color-primary)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  className="text-base leading-relaxed relative z-10 pl-20"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompanyFlow;
