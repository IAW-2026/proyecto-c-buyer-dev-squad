"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  AlertTriangle,
  ShoppingBag,
  CheckCircle,
  X,
} from "lucide-react";
import { removeFromCartAction } from "@/lib/actions/Cart.actions";

export default function CartList({ items, total }: any) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && removingId) {
      setRemovingId(null);
    }
  }, [isPending]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  async function confirmRemove() {
    if (!itemToDelete) return;

    const item = items.find((i: any) => i.id === itemToDelete);
    const itemName = item?.name || "Producto";

    setRemovingId(itemToDelete);
    setItemToDelete(null);

    await removeFromCartAction(itemToDelete);

    setSuccessMessage(`${itemName} eliminado del carrito`);

    startTransition(() => {
      router.refresh();
    });
  }

  async function handleOrder() {
    setIsCheckingOut(true);
    router.push("/checkout");
  }

  return (
    <div>
      <div className="space-y-3">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border border-muted p-4 rounded-xl bg-surface"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-surface-alt border border-muted flex-shrink-0">
              <img
                src={item.imageUrl || "/placeholder.png"}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-foreground truncate">
                {item.name}
              </h2>

              <div className="flex items-center gap-2 mt-1.5">
                {item.size && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-alt border border-muted text-muted">
                    Talle {item.size}
                  </span>
                )}
                {item.color && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-alt border border-muted text-muted">
                    {item.color}
                  </span>
                )}
                <span className="text-xs text-muted">x{item.quantity}</span>
              </div>

              <p className="text-sm font-semibold text-foreground mt-2">
                ${item.price.toLocaleString("es-AR")}
              </p>
            </div>

            <button
              onClick={() => setItemToDelete(item.id)}
              disabled={removingId === item.id}
              className="p-2.5 rounded-lg text-muted hover:text-danger hover:bg-surface-alt transition disabled:opacity-50 flex-shrink-0"
              aria-label="Eliminar producto"
            >
              {removingId === item.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-muted pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Total</h3>
          <p className="text-2xl sm:text-3xl font-bold text-success">
            ${total.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleOrder}
          disabled={isCheckingOut}
          className="w-full inline-flex items-center justify-center gap-2 btn-success font-semibold py-3 px-4 rounded-xl transition disabled:opacity-50"
        >
          {isCheckingOut && <Loader2 className="w-4 h-4 animate-spin" />}
          {isCheckingOut ? "Redirigiendo..." : "Proceder al Pago"}
        </button>
      </div>

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-alt border border-muted rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-full bg-surface text-danger">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                ¿Eliminar producto?
              </h2>
            </div>

            <p className="text-sm text-muted mt-2 ml-[52px]">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setItemToDelete(null)}
                disabled={removingId === itemToDelete}
                className="px-4 py-2 rounded-lg border border-muted text-muted hover:text-foreground transition disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={confirmRemove}
                disabled={removingId === itemToDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-danger disabled:opacity-50"
              >
                {removingId === itemToDelete && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {removingId === itemToDelete ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm sm:w-auto">
          <div className="flex items-center gap-3 bg-surface-alt border border-success/20 shadow-lg rounded-xl px-4 py-3 pr-2">
            <div className="p-1.5 rounded-full bg-success/10 text-success flex-shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {successMessage}
            </p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition flex-shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}