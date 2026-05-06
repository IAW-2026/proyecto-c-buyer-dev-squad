"use client";

import Link from "next/link";
import { useCartCount } from "../hooks/UseCartCount";

export default function CartButton() {
  const count = useCartCount();

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-800 transition"
    >
      🛒 {count > 0 && <span>({count})</span>}
    </Link>
  );
}