"use client";

import { useEffect, useState, useTransition } from "react";
import { getCartCount } from "@/lib/actions/Cart.actions";
import { useUser } from "@clerk/nextjs";

export function useCartCount() {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { isSignedIn, isLoaded } = useUser();

  const update = () => {
    startTransition(async () => {
      const total = await getCartCount();
      setCount(total);
    });
  };

  useEffect(() => {
    if (isLoaded) {
      update();
    }
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  return { count, loading: isPending };
}
