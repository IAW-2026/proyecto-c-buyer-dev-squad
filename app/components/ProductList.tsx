"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductList({ products }: any) {
  console.log("🚀 ~ file: ProductList.tsx:4 ~ ProductList ~ products:", products);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const router = useRouter();

  async function addToCart(productId: string) {
    setLoadingId(productId);

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    setLoadingId(null);
    setAddedId(productId);

    setTimeout(() => setAddedId(null), 2200);
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {products.map((p: any) => {
        const isLoading = loadingId === p.id;
        const isAdded = addedId === p.id;
        const isDisabled = isLoading || isAdded;

        return (
          <div key={p.id} className="border p-4 rounded-xl">
            <div
              onClick={() => router.push(`/products/${p.id}`)}
              className="cursor-pointer"
            >
              <div className="mb-4 h-48 overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="mt-2 text-lg font-bold">${p.price}</p>
            </div>

            <button
              onClick={() => addToCart(p.id)}
              disabled={isDisabled}
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors duration-200
                ${isAdded
                  ? "bg-green-600 text-white"
                  : "bg-black text-white disabled:opacity-50"
                }`}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}

              {isAdded && (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}

              {isLoading ? "Agregando..." : isAdded ? "¡Agregado!" : "Agregar al carrito"}
            </button>

          </div>
        );
      })}
    </div>
  );
}