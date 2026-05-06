"use client";

import { useEffect, useState } from "react";

export function useCartCount() {
  const [count, setCount] = useState(0);

  const update = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    setCount(total);
  };

  useEffect(() => {
    update(); 

    window.addEventListener("cartUpdated", update);

    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  return count;
}