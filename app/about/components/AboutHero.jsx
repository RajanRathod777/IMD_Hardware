export default function AboutHero() {
  return (
    <section className="mb-24 text-center">
      <div
        className="w-full py-24 text-white relative overflow-hidden"
        style={{
          background: "var(--gradient-primary)",
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Building the Future
          </h1>
          <p
            className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Premium hardware solutions trusted by professionals and visionaries
            for over 15 years.
          </p>
        </div>
      </div>
    </section>
  );
}
