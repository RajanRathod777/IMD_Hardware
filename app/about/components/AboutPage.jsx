'use client';

import AboutHero from "./AboutHero";
import CompanyOverview from "./CompanyOverview";
import TrendingProducts from "./TrendingProducts";
import ProductAssemblies from "./ProductAssemblies";
import CompanyFlow from "./CompanyFlow";
import QualityAssurance from "./QualityAssurance";
import ContactInfo from "./ContactInfo";
import CTASection from "./CTASection";
import AboutContent from "./AboutContent";

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AboutHero />
      <AboutContent />
      <CompanyOverview />
      <TrendingProducts />
      <ProductAssemblies />
      <CompanyFlow />
      <QualityAssurance />
      <ContactInfo />
      <CTASection />
    </div>
  );
};

export default AboutPage;
