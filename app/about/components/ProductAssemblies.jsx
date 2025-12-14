"use client";
import { DoorOpen, Package, Shield } from "lucide-react";

const ProductAssemblies = () => {
  const productAssemblies = [
    {
      id: 1,
      title: "Complete Door Lock System",
      components: ["Mortise Lock", "Handle Set", "Strike Plate", "Keys"],
      icon: DoorOpen,
      time: "15-20 mins",
    },
    {
      id: 2,
      title: "Cabinet Hardware Kit",
      components: ["Hinges", "Handles", "Drawer Slides", "Mounting Screws"],
      icon: Package,
      time: "10-15 mins",
    },
    {
      id: 3,
      title: "Security System Bundle",
      components: [
        "Main Lock",
        "Additional Deadbolt",
        "Security Bolts",
        "Installation Tools",
      ],
      icon: Shield,
      time: "25-30 mins",
    },
  ];

  return (
    <section className="mb-24">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-3xl font-bold text-center mb-12"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Complete Product Assemblies
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productAssemblies.map((assembly) => {
            const IconComponent = assembly.icon;
            return (
              <div
                key={assembly.id}
                className="group shadow-md border p-8 hover:shadow-xl transition-shadow bg-white"
                style={{
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gray-50 group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                    <IconComponent
                      className="w-10 h-10 group-hover:text-white transition-colors duration-300"
                      style={{ color: "var(--color-primary)" }}
                    />
                  </div>
                </div>
                <h3
                  className="text-xl font-bold mb-6 text-center"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {assembly.title}
                </h3>
                <div className="mb-6">
                  <h4
                    className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                      borderColor: "var(--color-border-light)",
                    }}
                  >
                    Includes:
                  </h4>
                  <ul className="space-y-3">
                    {assembly.components.map((component, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 mr-3"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        ></span>
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="flex justify-between items-center mt-6 pt-6 border-t"
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    ⏱ {assembly.time}
                  </span>
                  <button
                    className="font-bold text-sm uppercase tracking-wide hover:underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    View Guide
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductAssemblies;
