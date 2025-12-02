"use client";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import { useState } from "react";

const CartActions = ({ product, inCart }) => {
  const { addToCart, updateCartQuantity, removeFromCart } = useStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    addToCart(product, 1);
    setIsAdding(false);
  };

  if (inCart) {
    return (
      <div
        className="pt-6 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-4">
          <QuantityControls
            product={product}
            inCart={inCart}
            onUpdateQuantity={updateCartQuantity}
          />
          <RemoveButton
            productId={product.product_id}
            onRemove={removeFromCart}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="pt-6 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <AddToCartButton
        product={product}
        onAddToCart={handleAddToCart}
        isAdding={isAdding}
      />
    </div>
  );
};

const QuantityControls = ({ product, inCart, onUpdateQuantity }) => (
  <div
    className="flex items-center gap-2 border rounded-xl p-1 shadow-sm"
    style={{
      backgroundColor: "var(--color-surface)",
      borderColor: "var(--color-border)",
    }}
  >
    <button
      className="w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:bg-[var(--color-bg-alt)]"
      style={{ color: "var(--color-text-secondary)" }}
      onClick={(e) => {
        e.preventDefault();
        onUpdateQuantity(product.product_id, inCart.quantity - 1);
      }}
      disabled={inCart.quantity <= 1}
    >
      <Minus size={20} />
    </button>

    <span
      className="min-w-12 text-center font-bold text-lg"
      style={{ color: "var(--color-text-primary)" }}
    >
      {inCart.quantity}
    </span>

    <button
      className="w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:bg-[var(--color-bg-alt)]"
      style={{ color: "var(--color-text-secondary)" }}
      onClick={(e) => {
        e.preventDefault();
        onUpdateQuantity(product.product_id, inCart.quantity + 1);
      }}
      disabled={inCart.quantity >= product.max_quantity}
    >
      <Plus size={20} />
    </button>
  </div>
);

const RemoveButton = ({ productId, onRemove }) => (
  <button
    className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    style={{
      backgroundColor: "var(--color-danger)",
      color: "var(--color-text-on-primary)",
    }}
    onClick={(e) => {
      e.preventDefault();
      onRemove(productId);
    }}
  >
    <Trash2 size={20} />
    Remove
  </button>
);

const AddToCartButton = ({ product, onAddToCart, isAdding }) => (
  <button
    className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-101 ${
      product.max_quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
    } ${isAdding ? "opacity-75 cursor-wait" : ""}`}
    style={{
      backgroundColor: "var(--color-text-primary)",
      color: "var(--color-text-on-primary)",
    }}
    onClick={onAddToCart}
    disabled={isAdding || product.max_quantity === 0}
  >
    <ShoppingCart size={24} />
    {product.max_quantity === 0 ? "Out of Stock" : "Add to Cart"}
  </button>
);

export default CartActions;
