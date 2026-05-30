"use client";

import { useEffect, useState, useTransition } from "react";
import { getCartCount } from "@/lib/actions/Cart.actions";

export function useCartCount() {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const update = () => {
    startTransition(async () => {
      const total = await getCartCount();
      setCount(total);
    });
  };

  useEffect(() => {
    update();
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  return { count, loading: isPending };
}