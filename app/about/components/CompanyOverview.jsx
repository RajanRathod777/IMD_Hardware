"use client";

const CompanyOverview = () => {
  const stats = [
    { value: "15K+", label: "Products Catalog" },
    { value: "50K+", label: "Satisfied Clients" },
    { value: "15+", label: "Years of Excellence" },
    { value: "24/7", label: "Expert Support" },
  ];

  return (
    <section className="mb-24">
      <div
        className="max-w-7xl mx-auto border-t border-b py-12"
        style={{ borderColor: "var(--color-border-light)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div
                className="text-4xl md:text-5xl font-bold mb-2 transition-colors duration-300 group-hover:scale-110 transform"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm uppercase tracking-widest font-semibold"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;
