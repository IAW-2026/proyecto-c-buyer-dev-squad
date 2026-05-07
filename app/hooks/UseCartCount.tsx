"use client";

import { useEffect, useState } from "react";

export function useCartCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const update = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const cart = await response.json();
        const total = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCount(total);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    update();
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  return { count, loading };
}