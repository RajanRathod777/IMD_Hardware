"use client";
import { DoorOpen, Package, Shield } from 'lucide-react';

const ProductAssemblies = () => {
  const productAssemblies = [
    {
      id: 1,
      title: "Complete Door Lock System",
      components: ["Mortise Lock", "Handle Set", "Strike Plate", "Keys"],
      icon: DoorOpen,
      time: "15-20 mins"
    },
    {
      id: 2,
      title: "Cabinet Hardware Kit",
      components: ["Hinges", "Handles", "Drawer Slides", "Mounting Screws"],
      icon: Package,
      time: "10-15 mins"
    },
    {
      id: 3,
      title: "Security System Bundle",
      components: ["Main Lock", "Additional Deadbolt", "Security Bolts", "Installation Tools"],
      icon: Shield,
      time: "25-30 mins"
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Complete Product Assemblies</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productAssemblies.map((assembly) => {
          const IconComponent = assembly.icon;
          return (
            <div key={assembly.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <IconComponent className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{assembly.title}</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Includes:</h4>
                <ul className="space-y-1">
                  {assembly.components.map((component, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {component}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Assembly Time: {assembly.time}</span>
                <button className="text-blue-600 font-semibold hover:text-blue-700">View Guide</button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductAssemblies;