
"use client"
import { create } from "zustand";

const fetchProducts = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:4444";
  try {
    const res = await fetch(`${apiUrl}/api/v1/product`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    console.log("call fetch product", data);

    return data.products || [];
  } catch (err) {
    console.error(err.message);
    return [];
  }
};

const fetchCategories = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:4444";
  try {
    const res = await fetch(`${apiUrl}/api/v1/product/category/get/all`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    if (data.status) {
      console.log("call fetch category ", data);

      return data.categories || [];
    } else {
      throw new Error(data.message || "Failed to get categories");
    }
  } catch (err) {
    console.error(err.message);
    return [];
  }
};

export const useStore = create((set, get) => ({
  products: [],
  cart: [],
  categories: [],
  coupon: null, // NEWUSER12
  checkedOrder: null,
  signOrder: null,

  // Set discount type
  adddiscountType: (type) => set({ discountType: type }),

  // Set discount value
  adddiscountValue: (value) => set({ discountValue: value }),

  // Set coupon code
  addCouponCode: (code) => set({ couponCode: code }),

  // Set coupon object
  addCoupon: (coupon) => set({ coupon }),

  // Clear coupon
  clearCoupon: () => set({ coupon: null }),

  // Add checked order after API success
  addCheckedOrder: (checkedOrder) => set({ checkedOrder }),

  // Add signOrder after API success
  addSignOrder: (signOrder) => set({ signOrder }),

  // Add products
  addProducts: async () => {
    set({ products: (await fetchProducts()) || [] });
  },
  // Add categories
  addCategories: async () => {
    set({ categories: (await fetchCategories()) || [] });
  },

  // Clear the cart
  clearCart: () => set({ cart: [] }),

  // Add product to cart
  addToCart: (product) => {
    const cart = get().cart;
    const exists = cart.find((p) => p.product_id === product.product_id);
    if (exists) {
      set({
        cart: cart.map((p) =>
          p.product_id === product.product_id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        ),
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  // Remove product from cart
  removeFromCart: (id) =>
    set({ cart: get().cart.filter((p) => p.product_id !== id) }),

  // Update product quantity
  updateCartQuantity: (id, quantity) => {
    const cart = get().cart;
    const product = cart.find((p) => p.product_id === id);
    if (!product) return;
    // Ensure valid quantity
    const newQuantity = Math.max(
      1,
      Math.min(quantity, product.max_quantity || 10)
    );
    set({
      cart: cart.map((p) =>
        p.product_id === id ? { ...p, quantity: newQuantity } : p
      ),
    });
  },

  // Get product by ID
  getProductById: (id) => {
    const products = get().products;
    return products.find((p) => p.product_id === id) || null;
  },

  // Get category by ID
  getCategoryById: (id) => {
    const categories = get().categories;
    return categories.find((c) => c.product_category_id === id) || null;
  },
}));
