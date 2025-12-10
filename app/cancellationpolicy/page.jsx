import React from "react";

const CancellationPolicy = () => {
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
        Cancellation & Refund Policy
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Order Cancellations</h2>
        <p className="mb-4 leading-relaxed">
          You can cancel your order at any time before it has been shipped. To
          cancel your order, please contact us immediately at{" "}
          <a
            href="mailto:imd@imdhardware.com"
            className="text-blue-600 hover:underline"
          >
            imd@imdhardware.com
          </a>{" "}
          or call our customer support.
        </p>
        <p className="mb-4 leading-relaxed">
          If the order has already been shipped, you will need to follow our
          Return Policy procedure once you receive the package.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Refund Processing</h2>
        <p className="mb-4 leading-relaxed">
          Once a cancellation is approved, a full refund will be initiated to
          your original payment method. Please allow 5-7 business days for the
          refund to reflect in your account, depending on your bank's processing
          time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          3. Late or Missing Refunds
        </h2>
        <p className="mb-4 leading-relaxed">
          If you haven’t received a refund yet, first check your bank account
          again. Then contact your credit card company, it may take some time
          before your refund is officially posted. Next, contact your bank.
          There is often some processing time before a refund is posted.
        </p>
        <p className="mb-4 leading-relaxed">
          If you’ve done all of this and you still have not received your refund
          yet, please contact us at{" "}
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

export default CancellationPolicy;
