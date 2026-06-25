"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import { removeFromCartAction } from "@/lib/actions/Cart.actions";

export default function CartList({ items, total }: any) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const router = useRouter();

  const isDeleting = removingId !== null;

  // Auto-cierre del toast de éxito a los 3 segundos
  useEffect(() => {
    if (!showSuccessToast) return;
    const timer = setTimeout(() => setShowSuccessToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showSuccessToast]);

  async function confirmRemove() {
    if (!itemToDelete) return;

    setRemovingId(itemToDelete);

    await removeFromCartAction(itemToDelete);

    setRemovingId(null);
    setItemToDelete(null);
    setShowSuccessToast(true);
    router.refresh();
  }

  async function handleOrder() {
    setIsCheckingOut(true);
    router.push("/checkout");
  }

  return (
    <div>
      <div className="space-y-3">
        {items.map((item: any) => {
          const isThisItemDeleting = removingId === item.id;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 border border-muted p-4 rounded-xl bg-surface transition-opacity ${
                isThisItemDeleting ? "opacity-50" : ""
              }`}
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
                disabled={isDeleting}
                className="p-2.5 rounded-lg text-muted hover:text-danger hover:bg-surface-alt transition disabled:opacity-50 flex-shrink-0"
                aria-label="Eliminar producto"
              >
                {isThisItemDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        })}
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
          <div className="relative bg-surface-alt border border-muted rounded-2xl p-6 w-full max-w-sm overflow-hidden">
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
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-muted text-muted hover:text-foreground transition disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={confirmRemove}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-danger disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>

            {/* Overlay de loading sobre todo el modal */}
            {isDeleting && (
              <div className="absolute inset-0 bg-surface-alt/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-danger animate-spin" />
                <p className="text-sm font-medium text-foreground">
                  Eliminando producto...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast de confirmación al eliminar */}
      {showSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 bg-surface-alt border border-muted shadow-lg rounded-xl px-4 py-3 pr-2">
            <div className="p-1.5 rounded-full bg-success/10 text-success flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-foreground whitespace-nowrap">
              Producto eliminado del carrito
            </p>
            <button
              onClick={() => setShowSuccessToast(false)}
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