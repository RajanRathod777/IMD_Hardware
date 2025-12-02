"use client";
import { Package, Shield, Wrench, Mail, Truck, Phone } from 'lucide-react';

const CompanyFlow = () => {
  const companyFlow = [
    { step: 1, title: "Product Sourcing", description: "Direct partnerships with top manufacturers", icon: Package },
    { step: 2, title: "Quality Check", description: "Rigorous testing and quality assurance", icon: Shield },
    { step: 3, title: "Inventory Management", description: "Smart stock optimization", icon: Wrench },
    { step: 4, title: "Customer Order", description: "Easy online ordering process", icon: Mail },
    { step: 5, title: "Fast Shipping", description: "Quick and reliable delivery", icon: Truck },
    { step: 6, title: "After-Sales Support", description: "Continuous customer service", icon: Phone }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Business Process</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyFlow.map((step) => {
          const IconComponent = step.icon;
          return (
            <div key={step.step} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  {step.step}
                </div>
                <IconComponent className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CompanyFlow;