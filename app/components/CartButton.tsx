"use client";

import Link from "next/link";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartCount } from "../hooks/UseCartCount";
import { useUser, useClerk } from "@clerk/nextjs";

export default function CartButton() {
  const { count, loading } = useCartCount();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  function handleClick(e: React.MouseEvent) {
    if (!isSignedIn) {
      e.preventDefault();
    openSignIn({
      forceRedirectUrl: "/cart",
    });
    }
  }

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-2 z-40">
        <ShoppingCart className="w-5 h-5" />
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <Link
      href="/cart"
      onClick={handleClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg shadow-[var(--color-primary)]/20 hover:scale-105 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 active:scale-95 transition-all duration-200 z-40"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="absolute -top-2 -right-2 bg-[var(--color-danger)] text-white text-xs font-bold min-w-[22px] h-[22px] px-1 flex items-center justify-center rounded-full">
        {count}
      </span>
    </Link>
  );
}