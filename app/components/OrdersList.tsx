"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { getFiveMoreOrders } from "@/lib/actions/Order.actions";
import { getShipmentTrackingUrl } from "@/lib/actions/Shipment.actions";
import { getCreateReviewUrl } from "@/lib/actions/handoff.actions";

const statusLabel: Record<string, string> = {
  PENDING: "En proceso",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
};

const statusStyle: Record<string, string> = {
  PENDING: "bg-surface text-info",
  PAID: "bg-surface text-success",
  SHIPPED: "bg-surface text-warning",
  DELIVERED: "bg-surface text-primary",
};

export default function OrdersList({
  initialOrders,
}: {
  initialOrders: any[];
}) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [orders, setOrders] = useState(initialOrders);
  const [hasMore, setHasMore] = useState(initialOrders.length === 5);
  const [isPending, startTransition] = useTransition();

  // Trackea qué pedido está generando su token ahora mismo, para
  // deshabilitar solo ESE botón y no toda la lista.
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  // Trackea qué link de reseña (producto o vendedor, por item) está
  // generando su token ahora mismo.
  const [loadingReviewKey, setLoadingReviewKey] = useState<string | null>(
    null
  );

  const loadMore = () => {
    startTransition(async () => {
      const newOrders = await getFiveMoreOrders(orders.length);

      if (newOrders.length < 5) {
        setHasMore(false);
      }

      setOrders((prev) => [...prev, ...newOrders]);
    });
  };

  const handleTrackShipment = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      const url = await getShipmentTrackingUrl(orderId, resolvedTheme);
      router.push(url);
    } catch (err) {
      console.error("No se pudo generar el link de tracking:", err);
      // Fallback: lleva igual a la página de shipping, sin token.
      // El usuario va a tener que loguearse ahí, pero no se queda trabado.
      router.push(
        `${process.env.NEXT_PUBLIC_SHIPPING_URL}/dashboard/shipments/${orderId}`
      );
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleCreateReview = async (
    tipo: "product" | "seller",
    targetId: string,
    key: string
  ) => {
    setLoadingReviewKey(key);
    try {
      const url = await getCreateReviewUrl(tipo, targetId, resolvedTheme);
      router.push(url);
    } catch (err) {
      console.error("No se pudo generar el link de reseña:", err);
      // Fallback: igual que con el tracking, manda sin token.
      router.push(
        `${process.env.NEXT_PUBLIC_FEEDBACK_URL}/dashboard/crear-resena?tipo=${tipo}&id=${targetId}`
      );
    } finally {
      setLoadingReviewKey(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {orders.map((pedido) => (
          <div
            key={pedido.id}
            className="border border-muted rounded-2xl p-4 sm:p-5 shadow-sm bg-surface-alt w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Pedido #{pedido.id}
                </p>

                <p className="text-xs text-muted">
                  {new Date(pedido.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  statusStyle[pedido.status]
                }`}
              >
                {statusLabel[pedido.status]}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {pedido.items.map((item: any) => {
                const productKey = `${item.id}-product`;
                const sellerKey = `${item.id}-seller`;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                  >
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-surface flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">
                        {item.name}
                      </p>

                      <p className="text-xs text-muted">
                        {item.size && `Talle ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color}
                        {` · x${item.quantity}`}
                      </p>

                      {item.product?.seller && (
                        <p className="text-xs text-muted mt-1">
                          Vendido por: {item.product.seller.name}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <p className="text-sm font-semibold text-foreground">
                        $
                        {(item.price * item.quantity).toLocaleString(
                          "es-AR"
                        )}
                      </p>

                      {pedido.status === "DELIVERED" && (
                        <div className="flex flex-col items-end gap-1">
                          <button
                            onClick={() =>
                              handleCreateReview(
                                "product",
                                item.productId,
                                productKey
                              )
                            }
                            disabled={loadingReviewKey === productKey}
                            className="text-info underline text-xs font-medium hover:opacity-80 transition disabled:opacity-50"
                          >
                            {loadingReviewKey === productKey
                              ? "Generando link..."
                              : "Agregar reseña"}
                          </button>

                          {item.product?.seller && (
                            <button
                              onClick={() =>
                                handleCreateReview(
                                  "seller",
                                  item.product.seller.id,
                                  sellerKey
                                )
                              }
                              disabled={loadingReviewKey === sellerKey}
                              className="text-info underline text-xs font-medium hover:opacity-80 transition disabled:opacity-50"
                            >
                              {loadingReviewKey === sellerKey
                                ? "Generando link..."
                                : "Dejar opinión"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="font-bold text-base text-foreground">
                Total: ${pedido.total.toLocaleString("es-AR")}
              </p>

              {pedido.status !== "PENDING" && pedido.status !== "DELIVERED" && (
                <button
                  onClick={() => handleTrackShipment(pedido.id)}
                  disabled={loadingOrderId === pedido.id}
                  className="px-4 py-2 rounded-xl border text-sm font-medium hover:opacity-80 transition disabled:opacity-50"
                >
                  {loadingOrderId === pedido.id
                    ? "Generando link..."
                    : "Ver estado del envío"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-5 py-2 rounded-xl border font-medium hover:opacity-80 transition disabled:opacity-50"
          >
            {isPending ? "Cargando..." : "Ver más"}
          </button>
        </div>
      )}
    </>
  );
}