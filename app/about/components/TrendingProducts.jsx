"use client";
import { Lock, DoorOpen, Package, Wrench } from "lucide-react";

const TrendingProducts = () => {
  const trendingProducts = [
    {
      id: 1,
      name: "Smart Digital Lock",
      category: "Security",
      icon: Lock,
      description:
        "Advanced biometric digital lock with mobile app integration",
    },
    {
      id: 2,
      name: "Stainless Steel Hinges",
      category: "Door Hardware",
      icon: DoorOpen,
      description:
        "Corrosion-resistant heavy-duty hinges for long-lasting performance",
    },
    {
      id: 3,
      name: "Cabinet Handle Set",
      category: "Cabinet Hardware",
      icon: Package,
      description: "Elegant modern handles with easy installation",
    },
    {
      id: 4,
      name: "Glass Fitting Kit",
      category: "Glass Accessories",
      icon: Wrench,
      description: "Complete set for glass door and cabinet installations",
    },
  ];

  return (
    <section className="mb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2
            className="text-3xl font-bold"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Trending Products
          </h2>
          <button
            className="font-bold border-b-2 pb-1 transition-colors hover:opacity-80"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
            }}
          >
            View All Collection
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => {
            const IconComponent = product.icon;
            return (
              <div
                key={product.id}
                className="group shadow-md border p-8 hover:shadow-xl transition-all duration-300 bg-white"
                style={{
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div className="flex mb-6">
                  <IconComponent
                    className="w-10 h-10"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {product.category}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {product.name}
                </h3>
                <p
                  className="mb-6 text-sm leading-relaxed"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {product.description}
                </p>
                <button
                  className="w-full py-3 font-semibold transition-colors border block text-center hover:text-white"
                  style={{
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-primary)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-primary)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--color-primary)";
                  }}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
