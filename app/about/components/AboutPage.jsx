"use client";

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
    <div className="bg-white">
      <AboutHero />
      <div className="px-4 sm:px-6 lg:px-8">
        <AboutContent />
        <CompanyOverview />
        <TrendingProducts />
        <ProductAssemblies />
        <CompanyFlow />
        <QualityAssurance />
        <ContactInfo />
      </div>
      <CTASection />
    </div>
  );
};

export default AboutPage;
