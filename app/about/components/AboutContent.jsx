const AboutContent = () => {
  return (
    <div className="max-w-3xl mx-auto mb-24 space-y-24">
      {/* Header Section */}
      <div className="text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          About Our Hardware Solutions
        </h2>
        <div
          className="w-16 h-1 mx-auto mb-8"
          style={{ backgroundColor: "var(--color-primary)" }}
        ></div>
        <p
          className="text-lg md:text-xl leading-relaxed text-center"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          Your trusted partner for premium hardware tools and accessories that
          stand the test of time. We believe in quality, durability, and
          innovation.
        </p>
      </div>

      <MissionStatement />
      <HardwareImportance />
      <SelectionGuide />
      <div className="space-y-24">
        <ProductCategories />
        <WhyChooseUs />
      </div>
    </div>
  );
};

const MissionStatement = () => (
  <section
    className="p-8 md:p-12 border-l-4"
    style={{
      backgroundColor: "var(--color-bg-alt)",
      borderColor: "var(--color-primary)",
    }}
  >
    <h3
      className="text-2xl font-bold mb-4"
      style={{
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-heading)",
      }}
    >
      Our Commitment to Excellence
    </h3>
    <p
      className="text-lg leading-relaxed"
      style={{ color: "var(--color-text-secondary)" }}
    >
      We are dedicated to providing our customers with the highest quality
      hardware products at the most competitive prices. Our experienced team is
      committed to building lasting relationships through exceptional service
      and expert guidance.
    </p>
  </section>
);

const HardwareImportance = () => (
  <section>
    <h3
      className="text-2xl font-bold mb-6"
      style={{
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-heading)",
      }}
    >
      Essential Hardware for Modern Living
    </h3>
    <div className="space-y-6 text-lg leading-relaxed">
      <p style={{ color: "var(--color-text-secondary)" }}>
        Hardware tools form the foundation of every construction and repair
        project. From basic household tools like hammers and screwdrivers to
        specialized equipment, these instruments are indispensable for
        technicians, builders, and DIY enthusiasts alike.
      </p>
      <p style={{ color: "var(--color-text-secondary)" }}>
        The right hardware tools ensure precision, efficiency, and safety in
        every task. They connect components securely and enable complex assembly
        work with professional results.
      </p>
    </div>
  </section>
);

const SelectionGuide = () => (
  <section
    className="p-8 border"
    style={{
      backgroundColor: "var(--color-surface)",
      borderColor: "var(--color-border-light)",
    }}
  >
    <h3
      className="text-2xl font-bold mb-6"
      style={{
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-heading)",
      }}
    >
      Choosing the Right Hardware
    </h3>
    <div className="mb-6">
      <p
        className="font-semibold mb-4 text-lg"
        style={{ color: "var(--color-text-primary)" }}
      >
        Key considerations for selecting optimal hardware tools:
      </p>
      <ul className="space-y-4">
        {[
          "Material Quality: Opt for stainless steel or corrosion-resistant materials",
          "Safety Features: Prioritize tools with built-in safety mechanisms",
          "Ergonomic Design: Choose comfortable, user-friendly tools",
          "Long-term Durability: Invest in robust construction",
          "Value Proposition: Balance cost with long-term benefits",
        ].map((item, index) => (
          <li key={index} className="flex items-start">
            <span
              className="font-bold mr-4 text-xl"
              style={{ color: "var(--color-primary)" }}
            >
              •
            </span>
            <span style={{ color: "var(--color-text-secondary)" }}>
              <strong style={{ color: "var(--color-text-primary)" }}>
                {item.split(":")[0]}:
              </strong>{" "}
              {item.split(":")[1]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const ProductCategories = () => {
  const categories = [
    {
      title: "Security & Lock Systems",
      description:
        "Protect your property with our extensive range of security solutions.",
    },
    {
      title: "Door Hardware Collection",
      description:
        "Enhance functionality and aesthetics with our complete door hardware selection.",
    },
    {
      title: "Cabinet & Storage Solutions",
      description:
        "Transform your storage spaces with our premium cabinet hardware.",
    },
    {
      title: "Glass Fittings & Accessories",
      description:
        "Add elegance and sophistication with our glass hardware solutions.",
    },
  ];

  return (
    <section>
      <h3
        className="text-2xl font-bold mb-8 text-center"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        Comprehensive Hardware Categories
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="border p-8 hover:bg-gray-50 transition-colors"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h4
              className="text-xl font-semibold mb-3 flex items-center"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span
                className="w-1 h-6 mr-3"
                style={{ backgroundColor: "var(--color-primary)" }}
              ></span>
              {category.title}
            </h4>
            <p style={{ color: "var(--color-text-secondary)" }}>
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    "Premium Quality Products",
    "Expert Technical Support",
    "Competitive Pricing",
    "Fast Delivery",
  ];

  return (
    <section
      className="p-12 text-center"
      style={{
        backgroundColor: "var(--color-bg-alt)",
      }}
    >
      <h3
        className="text-2xl font-bold mb-8"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        Why Choose Us?
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 border"
            style={{
              borderColor: "var(--color-border-light)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center mb-3"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <span
              className="font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutContent;
