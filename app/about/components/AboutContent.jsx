"use client";

const AboutContent = () => {
  return (
    <>
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">About Our Hardware Solutions</h1>
        <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted partner for premium hardware tools and accessories that stand the test of time
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <LeftColumn />
        <RightColumn />
      </div>
    </>
  );
};

const LeftColumn = () => (
  <div className="space-y-8">
    <MissionStatement />
    <HardwareImportance />
    <SelectionGuide />
  </div>
);

const RightColumn = () => (
  <div className="space-y-8">
    <ProductCategories />
    <WhyChooseUs />
  </div>
);

const MissionStatement = () => (
  <section className="bg-gray-100 p-6 border-l-4 border-black">
    <h2 className="text-2xl font-bold text-black mb-4">Our Commitment to Excellence</h2>
    <p className="text-gray-700">
      We are dedicated to providing our customers with the highest quality hardware products at the most competitive prices. 
      Our experienced team is committed to building lasting relationships through exceptional service and expert guidance.
    </p>
  </section>
);

const HardwareImportance = () => (
  <section className="bg-white p-6 border border-gray-300">
    <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b border-gray-300">
      Essential Hardware for Modern Living
    </h2>
    <div className="space-y-4">
      <p className="text-gray-700">
        Hardware tools form the foundation of every construction and repair project. From basic household tools 
        like hammers and screwdrivers to specialized equipment, these instruments are indispensable for technicians, 
        builders, and DIY enthusiasts alike.
      </p>
      <p className="text-gray-700">
        The right hardware tools ensure precision, efficiency, and safety in every task. They connect components 
        securely and enable complex assembly work with professional results.
      </p>
    </div>
  </section>
);

const SelectionGuide = () => (
  <section className="bg-white p-6 border border-gray-300">
    <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b border-gray-300">
      Choosing the Right Hardware
    </h2>
    <div className="bg-gray-100 p-4">
      <p className="font-semibold text-black mb-4">
        Key considerations for selecting optimal hardware tools:
      </p>
      <ul className="space-y-3">
        {[
          "Material Quality: Opt for stainless steel or corrosion-resistant materials",
          "Safety Features: Prioritize tools with built-in safety mechanisms",
          "Ergonomic Design: Choose comfortable, user-friendly tools",
          "Long-term Durability: Invest in robust construction",
          "Value Proposition: Balance cost with long-term benefits"
        ].map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-black font-bold mr-3">•</span>
            <span><strong>{item.split(':')[0]}:</strong> {item.split(':')[1]}</span>
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
      description: "Protect your property with our extensive range of security solutions. From traditional deadbolts to modern digital locks..."
    },
    {
      title: "Door Hardware Collection",
      description: "Enhance functionality and aesthetics with our complete door hardware selection. Discover various hangers, closer mechanisms..."
    },
    {
      title: "Cabinet & Storage Solutions",
      description: "Transform your storage spaces with our premium cabinet hardware. From sleek hinges to elegant handles..."
    },
    {
      title: "Glass Fittings & Accessories",
      description: "Add elegance and sophistication with our glass hardware solutions. Our comprehensive range includes glass hinges..."
    }
  ];

  return (
    <section className="bg-white p-6 border border-gray-300">
      <h2 className="text-2xl font-bold text-black mb-6 pb-2 border-b border-gray-300">
        Comprehensive Hardware Categories
      </h2>
      <div className="space-y-6">
        {categories.map((category, index) => (
          <div key={index} className="border border-gray-300 p-5 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-black mb-3 flex items-center">
              <span className="w-2 h-6 bg-black mr-3"></span>
              {category.title}
            </h3>
            <p className="text-gray-700">{category.description}</p>
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
    "Fast Delivery"
  ];

  return (
    <section className="bg-gray-100 p-6 border border-gray-300">
      <h2 className="text-2xl font-bold text-black mb-4">Why Choose Us?</h2>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
              <span className="text-white font-bold">✓</span>
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutContent;