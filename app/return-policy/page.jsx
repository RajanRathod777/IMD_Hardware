import React from "react";

const ReturnPolicy = () => {
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
        Return & Refund Policy
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Returns</h2>
        <p className="mb-4 leading-relaxed">
          We have a 30-day return policy, which means you have 30 days after
          receiving your item to request a return.
        </p>
        <p className="mb-4 leading-relaxed">
          To be eligible for a return, your item must be in the same condition
          that you received it, unworn or unused, with tags, and in its original
          packaging. You’ll also need the receipt or proof of purchase.
        </p>
        <p className="mb-4 leading-relaxed">
          To start a return, you can contact us at{" "}
          <a
            href="mailto:imd@imdhardware.com"
            className="text-blue-600 hover:underline"
          >
            imd@imdhardware.com
          </a>
          . If your return is accepted, we will send you a return shipping
          label, as well as instructions on how and where to send your package.
          Items sent back to us without first requesting a return will not be
          accepted.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Damages and Issues</h2>
        <p className="mb-4 leading-relaxed">
          Please inspect your order upon reception and contact us immediately if
          the item is defective, damaged or if you receive the wrong item, so
          that we can evaluate the issue and make it right.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Exchanges</h2>
        <p className="mb-4 leading-relaxed">
          The fastest way to ensure you get what you want is to return the item
          you have, and once the return is accepted, make a separate purchase
          for the new item.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Refunds</h2>
        <p className="mb-4 leading-relaxed">
          We will notify you once we’ve received and inspected your return, and
          let you know if the refund was approved or not. If approved, you’ll be
          automatically refunded on your original payment method. Please
          remember it can take some time for your bank or credit card company to
          process and post the refund too.
        </p>
      </section>
    </div>
  );
};

export default ReturnPolicy;
