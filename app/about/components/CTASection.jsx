"use client";

const CTASection = () => {
  return (
    <section
      className="text-center py-24 text-white w-full bg-blue-900"
      style={{
        background: "var(--color-text-primary)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to Start Your Project?
        </h2>
        <p
          className="text-xl mb-12 opacity-90 leading-relaxed font-light"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Join thousands of satisfied customers who trust us for their hardware
          needs. Experience quality, durability, and excellence.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            className="px-12 py-4 font-bold transition-all hover:bg-white hover:text-black border-2 border-transparent"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
              fontFamily: "var(--font-primary)",
            }}
          >
            Browse Catalog
          </button>
          <button
            className="px-12 py-4 border-2 font-bold transition-all hover:bg-white hover:text-black"
            style={{
              borderColor: "white",
              color: "white",
              fontFamily: "var(--font-primary)",
            }}
          >
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
