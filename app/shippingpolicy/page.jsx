import React from "react";

const ShippingPolicy = () => {
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
        Shipping Policy
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          1. Shipping Processing Time
        </h2>
        <p className="mb-4 leading-relaxed">
          All orders are processed within 1-2 business days. Orders are not
          shipped or delivered on weekends or holidays. If we are experiencing a
          high volume of orders, shipments may be delayed by a few days. Please
          allow additional days in transit for delivery.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          2. Shipping Rates & Delivery Estimates
        </h2>
        <p className="mb-4 leading-relaxed">
          Shipping charges for your order will be calculated and displayed at
          checkout.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>Standard Shipping:</strong> 3-5 business days
          </li>
          <li>
            <strong>Express Shipping:</strong> 1-2 business days
          </li>
        </ul>
        <p className="mb-4 leading-relaxed">
          * Delivery delays can occasionally occur.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          3. Shipment Confirmation & Order Tracking
        </h2>
        <p className="mb-4 leading-relaxed">
          You will receive a Shipment Confirmation email once your order has
          shipped containing your tracking number(s). The tracking number will
          be active within 24 hours.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Customs, Duties and Taxes
        </h2>
        <p className="mb-4 leading-relaxed">
          IMD Hardware is not responsible for any customs and taxes applied to
          your order. All fees imposed during or after shipping are the
          responsibility of the customer (tariffs, taxes, etc.).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Damages</h2>
        <p className="mb-4 leading-relaxed">
          IMD Hardware is not liable for any products damaged or lost during
          shipping. If you received your order damaged, please contact the
          shipment carrier to file a claim. Please save all packaging materials
          and damaged goods before filing a claim.
        </p>
      </section>
    </div>
  );
};

export default ShippingPolicy;
