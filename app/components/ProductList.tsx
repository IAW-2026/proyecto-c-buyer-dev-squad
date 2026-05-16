"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductList({ products }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const router = useRouter();

async function addToCart(productId: string) {
  setLoadingId(productId);
  await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity: 1,
    }),
  });
//avisamos q cambió el carrito para actualizar el contador
  window.dispatchEvent(new Event("cartUpdated"));
  setLoadingId(null);
  setAddedId(productId);
  setTimeout(() => setAddedId(null), 2200);
}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p: any) => {
        return (
          <div key={p.id} className="border p-4 rounded-xl">
            <div
              onClick={() => router.push(`/products/${p.id}`)}
              className="cursor-pointer"
            >
              <div className="mb-4 h-40 md:h-48 overflow-hidden rounded-xl bg-surface-alt">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="text-lg md:text-xl font-semibold">{p.name}</h2>
              <p className="mt-2 text-base md:text-lg font-bold">${p.price}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}