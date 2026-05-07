"use client";

import Link from "next/link";
import { useCartCount } from "../hooks/UseCartCount";

export default function CartButton() {
  const { count, loading } = useCartCount();

  if (loading) {
  return (
    <div className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
      🛒

      <svg
        className="animate-spin h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />

        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
    </div>
  );
}

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-800 transition"
    >
      🛒<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[22px] h-[22px] px-1 flex items-center justify-center rounded-full">
        {count}
      </span>
    </Link>
  );
}