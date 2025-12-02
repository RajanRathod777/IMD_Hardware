"use client";
import { Lock, DoorOpen, Package, Wrench } from 'lucide-react';

const TrendingProducts = () => {
  const trendingProducts = [
    {
      id: 1,
      name: "Smart Digital Lock",
      category: "Security",
      icon: Lock,
      description: "Advanced biometric digital lock with mobile app integration"
    },
    {
      id: 2,
      name: "Stainless Steel Hinges",
      category: "Door Hardware",
      icon: DoorOpen,
      description: "Corrosion-resistant heavy-duty hinges for long-lasting performance"
    },
    {
      id: 3,
      name: "Cabinet Handle Set",
      category: "Cabinet Hardware",
      icon: Package,
      description: "Elegant modern handles with easy installation"
    },
    {
      id: 4,
      name: "Glass Fitting Kit",
      category: "Glass Accessories",
      icon: Wrench,
      description: "Complete set for glass door and cabinet installations"
    }
  ];

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
        <button className="text-blue-600 font-semibold hover:text-blue-700">View All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingProducts.map((product) => {
          const IconComponent = product.icon;
          return (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-center mb-4">
                <IconComponent className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-sm text-blue-600 font-semibold mb-2">{product.category}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingProducts;