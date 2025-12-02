"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

import {
  Search,
  Mic,
  Home,
  ShoppingBag,
  Info,
  Gift,
  User,
  LogIn,
  UserPlus,
  ShoppingCart,
} from "lucide-react";

import { useStore } from "../stores/useStore";

// Navigation items
const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/products", label: "Products", icon: ShoppingBag },
  { to: "/rewards", label: "Rewards", icon: Gift },
  { to: "/contact", label: "Contact", icon: User },
  { to: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { products, cart } = useStore();

  useEffect(() => {
    const t = Cookies.get("auth_token");
    setToken(t || null);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return setFilteredProducts([]);

    const query = searchQuery.toLowerCase();

    const results = products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.category_name?.toLowerCase().includes(query) ||
        product.title?.toLowerCase().includes(query) ||
        String(product.price).toLowerCase().includes(query) ||
        product.size?.toLowerCase().includes(query)
      );
    });

    setFilteredProducts(results);
  }, [searchQuery, products]);

  return (
    <header className="border border-[var(--color-border)] bg-[var(--color-surface)] p-2 m-1">
      <nav
        className="grid [grid-template-columns:15%_25%_45%_15%] gap-y-1 items-center 
        max-[1035px]:grid-cols-2 max-[1035px]:[grid-template-columns:1fr_1fr]"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <p className="text-base font-semibold text-[var(--color-text-primary)]">
              IMD Hardware
            </p>
          </Link>
        </div>

        {/* Profile / Login */}
        <div className="flex items-center justify-end gap-2 text-sm order-4 max-[1035px]:order-2">
          {token ? (
            <>
              {/* Profile */}
              <Link
                href="/profile"
                className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                <span className="p-1 px-2 bg-[var(--color-primary)] text-white text-[10px]">
                  {cart?.length || 0}
                </span>
              </Link>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>

              <span className="text-gray-400">/</span>

              {/* Register */}
              <Link
                href="/register"
                className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full mx-auto max-[1035px]:col-span-2 max-[1035px]:order-3">
          <Search className="absolute left-3 inset-y-0 my-auto w-4 h-4 text-gray-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full h-9 border border-[var(--color-border)] pl-9 pr-10 text-sm bg-[var(--color-surface)]"
          />

          <Mic className="absolute right-2 inset-y-0 my-auto w-4 h-4 text-gray-400" />

          {/* Dropdown */}
          {filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-[var(--color-surface)] border border-[var(--color-border)] mt-1 z-50 max-h-60 overflow-y-auto shadow-md">
              {filteredProducts.map((product) => (
                <Link
                  key={product.product_id}
                  href={`/product/${product.product_id}`}
                  className="block px-2 py-2 hover:bg-gray-100 border-b border-[var(--color-border)]"
                  onClick={() => setSearchQuery("")}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={`${apiUrl}/image/product/${product.images?.[0]}`}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="object-cover border border-[var(--color-border)]"
                    />
                    <div className="w-full">
                      <div className="flex justify-between">
                        <p>{product.name}</p>
                        <p>{product.price}</p>
                      </div>
                      <p className="text-sm">
                        {product.title?.length > 28
                          ? product.title.substring(0, 28) + "..."
                          : product.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="flex justify-center items-center space-x-6 text-sm max-[1035px]:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              href={to}
              className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Menu */}
      <div className="w-full fixed bottom-0 left-0 z-50 bg-[var(--color-surface)] shadow-md max-[1035px]:block hidden">
        <div className="grid grid-cols-5 text-center p-1 border border-[var(--color-border)]">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              href={to}
              className="p-2 flex flex-col items-center text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
