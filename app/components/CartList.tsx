"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartList({ items, total }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function removeItem(id: string) {
    setLoading(true);

    await fetch(`/api/cart?id=${id}`, {
      method: "DELETE",
    });
    setLoading(false);
    router.refresh();
  }

async function handleCheckout() {
  setLoading(true);

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: items, total }),
  });

  if (response.ok) {
    const data = await response.json();
    router.push(`/checkout-confirmation/${data.orderId}`);
  } else {
    alert("Error al procesar la compra");
    setLoading(false);
  }
}

  return (
    <div>
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="border border-muted p-4 rounded-xl bg-surface">
            <h2 className="text-xl">{item.name}</h2>
            <p>${item.price}</p>
            <p>Cantidad: {item.quantity}</p>
            <p>Talle: {item.size}</p>
            <p>Color: {item.color}</p>
            <button
              onClick={() => removeItem(item.id)}
              className="mt-2 btn-danger px-4 py-2 rounded"
              disabled={loading}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Total:</h3>
          <p className="text-3xl font-bold text-success">${total.toFixed(2)}</p>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full btn-success font-bold py-3 px-4 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Procesando..." : "Proceder al Pago"}
        </button>
      </div>
    </div>
  );
}