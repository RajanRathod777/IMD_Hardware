"use client";
import { Shield, Wrench, Package, Truck } from 'lucide-react';

const QualityAssurance = () => {
  const qualityFeatures = [
    { icon: Shield, title: "Raw Material Check", description: "Premium material selection" },
    { icon: Wrench, title: "Performance Testing", description: "Rigorous durability tests" },
    { icon: Package, title: "Safety Certification", description: "International standards" },
    { icon: Truck, title: "Packaging Quality", description: "Secure delivery guaranteed" }
  ];

  return (
    <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Quality Assurance Process</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {qualityFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="flex justify-center mb-3">
                <IconComponent className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QualityAssurance;