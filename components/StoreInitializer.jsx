"use client";
import { useEffect } from "react";
import { useStore } from "../stores/useStore";

export default function StoreInitializer() {
  useEffect(() => {
    // Initialize store data when app starts
    Promise.all([
      useStore.getState().addProducts(),
      useStore.getState().addCategories(),
    ]);
  }, []);

  return null; // This component doesn't render anything
}
