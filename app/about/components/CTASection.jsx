"use client";

const CTASection = () => {
  return (
    <section className="text-center bg-gray-900 rounded-3xl p-12 text-white">
      <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
        Join thousands of satisfied customers who trust us for their hardware needs
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          Browse Catalog
        </button>
        <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-colors">
          Contact Sales
        </button>
      </div>
    </section>
  );
};

export default CTASection;