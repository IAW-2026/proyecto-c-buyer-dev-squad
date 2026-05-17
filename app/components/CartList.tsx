"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartList({ items, total }: any) {
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const router = useRouter();

  async function confirmRemove() {
    if (!itemToDelete) return;

    setLoading(true);

    await fetch(`/api/cart?id=${itemToDelete}`, {
      method: "DELETE",
    });

    setLoading(false);
    setItemToDelete(null);
    router.refresh();
  }

  async function handleOrder() {
    setLoading(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items, total }),
    });

    if (!response.ok) {
    alert("Error al crear la orden");
    setLoading(false);
    return;
  }
  const data = await response.json();
  // Acá después iría la API real de pagos
  //const payment = await fetch("/api/payments/create-session");
  router.push(`/payments/${data.orderId}`); //le estoy mandando el id de la orden para que
  //  lo use en la página de pagos, ahí se simula el proceso de pago y se redirige a la confirmación
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-muted hover:text-foreground underline"
        >
          ← Volver
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="border border-muted p-4 rounded-xl bg-surface">
            <h2 className="text-xl">{item.name}</h2>
            <p>${item.price}</p>
            <p>Cantidad: {item.quantity}</p>
            <p>Talle: {item.size}</p>
            <p>Color: {item.color}</p>

            <button
              onClick={() => setItemToDelete(item.id)}
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
          <p className="text-3xl font-bold text-success">
            ${total.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleOrder}
          className="w-full btn-success font-bold py-3 px-4 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Procesando..." : "Proceder al Pago"}
        </button>
      </div>

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface-alt border border-muted rounded-2xl p-6 w-[90%] max-w-sm">
            
            <h2 className="text-lg font-semibold text-foreground">
              ¿Eliminar producto?
            </h2>

            <p className="text-sm text-muted mt-2">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-lg border border-muted text-muted hover:text-foreground"
              >
                Cancelar
              </button>

              <button
                onClick={confirmRemove}
                className="px-4 py-2 rounded-lg btn-danger"
              >
                Sí, eliminar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}