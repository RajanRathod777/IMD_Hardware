import React from "react";

const TermsConditions = () => {
  return (
    <div
      className="container mx-auto px-4 py-8 max-w-4xl"
      style={{
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      <h1
        className="text-3xl font-bold mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Terms and Conditions
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
        <p className="mb-4 leading-relaxed">
          This website is operated by IMD Hardware. Throughout the site, the
          terms “we”, “us” and “our” refer to IMD Hardware. IMD Hardware offers
          this website, including all information, tools and services available
          from this site to you, the user, conditioned upon your acceptance of
          all terms, conditions, policies and notices stated here.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. General Conditions</h2>
        <p className="mb-4 leading-relaxed">
          We reserve the right to refuse service to anyone for any reason at any
          time. You understand that your content (not including credit card
          information), may be transferred unencrypted and involve (a)
          transmissions over various networks; and (b) changes to conform and
          adapt to technical requirements of connecting networks or devices.
          Credit card information is always encrypted during transfer over
          networks.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Products or Services</h2>
        <p className="mb-4 leading-relaxed">
          Certain products or services may be available exclusively online
          through the website. These products or services may have limited
          quantities and are subject to return or exchange only according to our
          Return Policy. We have made every effort to display as accurately as
          possible the colors and images of our products that appear at the
          store. We cannot guarantee that your computer monitor's display of any
          color will be accurate.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Accuracy of Billing and Account Information
        </h2>
        <p className="mb-4 leading-relaxed">
          We reserve the right to refuse any order you place with us. We may, in
          our sole discretion, limit or cancel quantities purchased per person,
          per household or per order. You agree to provide current, complete and
          accurate purchase and account information for all purchases made at
          our store.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          5. Changes to Terms of Service
        </h2>
        <p className="mb-4 leading-relaxed">
          You can review the most current version of the Terms of Service at any
          time at this page. We reserve the right, at our sole discretion, to
          update, change or replace any part of these Terms of Service by
          posting updates and changes to our website. It is your responsibility
          to check our website periodically for changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Contact Information</h2>
        <p className="mb-4 leading-relaxed">
          Questions about the Terms of Service should be sent to us at{" "}
          <a
            href="mailto:imd@imdhardware.com"
            className="text-blue-600 hover:underline"
          >
            imd@imdhardware.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default TermsConditions;
