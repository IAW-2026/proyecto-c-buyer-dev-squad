"use client";

import { useState } from "react";

export default function ProductList({ products }: any) {
  const [loading, setLoading] = useState(false);

  async function addToCart(productId: string) {
    setLoading(true);

    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });

    setLoading(false);
    alert("Agregado al carrito");
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {products.map((p: any) => (
        <div key={p.id} className="border p-4 rounded-xl">
          <h2 className="text-xl">{p.name}</h2>
          <p>${p.price}</p>
          <button
            onClick={() => addToCart(p.id)}
            className="mt-2 bg-black text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
}