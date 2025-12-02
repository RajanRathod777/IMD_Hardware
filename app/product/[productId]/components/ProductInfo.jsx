import CartActions from "./CartActions";
import { Star, Check, Loader2, Shield, Truck, RotateCcw } from "lucide-react";
import { useStore } from "../../../../stores/useStore";

const ProductInfo = ({ product, extraDetails, loading }) => {
  const { cart } = useStore();
  const inCart = cart.find((p) => p.product_id === product.product_id);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={18}
        className={index < rating ? "" : ""}
        style={
          index < rating
            ? {
                fill: "var(--color-secondary)",
                color: "var(--color-secondary)",
              }
            : { color: "var(--color-border-strong)" }
        }
      />
    ));
  };

  return (
    <div className="space-y-8">
      <ProductHeader
        product={product}
        inCart={inCart}
        renderStars={renderStars}
      />

      <TrustBadges />

      <ProductDetailsGrid product={product} extraDetails={extraDetails} />

      <CartActions product={product} inCart={inCart} />
    </div>
  );
};

const ProductHeader = ({ product, inCart, renderStars }) => (
  <div className="space-y-4">
    {/* Category and Status Badges */}
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className="px-3 py-1.5 text-sm font-medium rounded-full shadow-sm"
        style={{
          background: "var(--gradient-primary)",
          color: "var(--color-text-on-primary)",
        }}
      >
        {product.category_name}
      </span>
      {inCart && (
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border"
          style={{
            backgroundColor: "var(--color-success-light)",
            color: "var(--color-success)",
            borderColor: "var(--color-success)",
          }}
        >
          <Check size={16} style={{ color: "var(--color-success)" }} />
          Added to Cart
        </span>
      )}
    </div>

    {/* Title and Name */}
    <div className="space-y-2">
      <h1
        className="text-4xl font-bold leading-tight"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        {product.title}
      </h1>
      <p
        className="text-xl font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {product.name}
      </p>
    </div>

    {/* Rating and Emoji */}
    <div className="flex items-center gap-4">
      <div
        className="flex items-center gap-2 border rounded-xl px-4 py-2 shadow-sm"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-1">
          {renderStars(product.star_rating || 0)}
        </div>
        <span
          className="ml-1 text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {product.star_rating || 0}/5
        </span>
      </div>
      <span className="text-2xl">{product.emoji}</span>
    </div>

    {/* Price and Stock */}
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <span
          className="text-4xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          ${product.price}
        </span>
        {product.original_price && product.original_price > product.price && (
          <span
            className="text-xl line-through"
            style={{ color: "var(--color-text-muted)" }}
          >
            ${product.original_price}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor:
              product.max_quantity > 10
                ? "var(--color-success)"
                : product.max_quantity > 0
                ? "var(--color-warning)"
                : "var(--color-danger)",
          }}
        ></div>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {product.max_quantity > 10
            ? `In Stock (${product.max_quantity} available)`
            : product.max_quantity > 0
            ? `Low Stock (${product.max_quantity} left)`
            : "Out of Stock"}
        </span>
      </div>
    </div>
  </div>
);

const TrustBadges = () => (
  <div
    className="grid grid-cols-3 gap-4 py-4 border-y"
    style={{ borderColor: "var(--color-border)" }}
  >
    <div
      className="flex items-center gap-2 text-sm"
      style={{ color: "var(--color-text-secondary)" }}
    >
      <Truck size={18} style={{ color: "var(--color-text-muted)" }} />
      <span>Free Shipping</span>
    </div>
    <div
      className="flex items-center gap-2 text-sm"
      style={{ color: "var(--color-text-secondary)" }}
    >
      <Shield size={18} style={{ color: "var(--color-text-muted)" }} />
      <span>2-Year Warranty</span>
    </div>
    <div
      className="flex items-center gap-2 text-sm"
      style={{ color: "var(--color-text-secondary)" }}
    >
      <RotateCcw size={18} style={{ color: "var(--color-text-muted)" }} />
      <span>30-Day Returns</span>
    </div>
  </div>
);

const ProductDetailsGrid = ({ product, extraDetails }) => (
  <div
    className="rounded-2xl p-6 border shadow-sm"
    style={{
      background:
        "linear-gradient(to bottom right, var(--color-bg), var(--color-surface))",
      borderColor: "var(--color-border)",
    }}
  >
    <h3
      className="text-lg font-semibold mb-4"
      style={{
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-heading)",
      }}
    >
      Product Details
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <DetailItem label="Size" value={product.size} icon="📏" />
      <DetailItem label="Material" value={product.material} icon="🔶" />
      <DetailItem
        label="Color"
        value={extraDetails?.color || product.color}
        icon="🎨"
      />
      <DetailItem
        label="Available Stock"
        value={`${product.max_quantity} units`}
        icon="📦"
      />
    </div>
  </div>
);

const DetailItem = ({ label, value, icon }) => (
  <div
    className="flex items-start gap-3 p-3 rounded-lg border shadow-xs"
    style={{
      backgroundColor: "var(--color-surface)",
      borderColor: "var(--color-border)",
    }}
  >
    <span className="text-lg">{icon}</span>
    <div className="space-y-1">
      <span
        className="font-semibold text-sm block"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </span>
      <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>
        {value}
      </p>
    </div>
  </div>
);

export default ProductInfo;
