"use client";

const CompanyOverview = () => {
  const stats = [
    { value: "15K+", label: "Products Available" },
    { value: "50K+", label: "Happy Customers" },
    { value: "15+", label: "Years Experience" }
  ];

  return (
    <section className="mb-16 text-center">
      <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
        Since 2008
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Leading Hardware Distribution</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompanyOverview;