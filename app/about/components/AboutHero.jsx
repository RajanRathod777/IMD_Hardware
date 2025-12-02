"use client";

const AboutHero = () => {
  return (
    <section className="mb-16 text-center">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Premium Hardware Solutions</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Trusted by professionals and DIY enthusiasts for over 15 years
        </p>
        <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all">
          Explore Products
        </button>
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white rounded-3xl p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Innovative Hardware Technology</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Smart security solutions and modern hardware designs
        </p>
        <button className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
          View Innovations
        </button>
      </div>
    </section>
  );
};

export default AboutHero;