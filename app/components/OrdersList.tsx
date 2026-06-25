"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Clock,
  CreditCard,
  Truck,
  PackageCheck,
  Star,
  MessageCircle,
  ChevronDown,
  Loader2,
  ShoppingBag,
} from "lucide-react";

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

const statusIcon: Record<string, React.ElementType> = {
  PENDING: Clock,
  PAID: CreditCard,
  SHIPPED: Truck,
  DELIVERED: PackageCheck,
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

  // Trackea qué link (reseña de producto u opinión de vendedor, por item)
  // está generando su token ahora mismo.
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
      router.push(
        `${process.env.NEXT_PUBLIC_SHIPPING_URL}/dashboard/shipments/${orderId}`
      );
    } finally {
      setLoadingOrderId(null);
    }
  };

  // tipo "product"  -> reseña del PRODUCTO
  // tipo "seller"   -> opinión del VENDEDOR
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
      router.push(
        `${process.env.NEXT_PUBLIC_FEEDBACK_URL}/dashboard/crear-resena?tipo=${tipo}&id=${targetId}`
      );
    } finally {
      setLoadingReviewKey(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-surface-alt border border-muted rounded-2xl py-16 px-6">
        <div className="p-4 bg-surface rounded-full mb-4">
          <ShoppingBag className="w-8 h-8 text-muted" />
        </div>
        <p className="text-foreground font-medium mb-1">
          Todavía no tenés pedidos
        </p>
        <p className="text-sm text-muted">
          Cuando compres algo, vas a verlo acá
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {orders.map((pedido) => {
          const StatusIcon = statusIcon[pedido.status];

          return (
            <div
              key={pedido.id}
              className="border border-muted rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow bg-surface-alt w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(pedido.createdAt).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    statusStyle[pedido.status]
                  }`}
                >
                  {StatusIcon && <StatusIcon className="w-3.5 h-3.5" />}
                  {statusLabel[pedido.status]}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {pedido.items.map((item: any) => {
                  const productKey = `${item.id}-product`;
                  const sellerKey = `${item.id}-seller`;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pb-4 border-b border-muted last:border-b-0 last:pb-0"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-surface border border-muted flex-shrink-0">
                        <img
                          src={item.product?.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {item.size && `Talle ${item.size}`}
                          {item.size && item.color && " · "}
                          {item.color}
                          {` · x${item.quantity}`}
                        </p>
                        {item.product?.seller && (
                          <p className="text-xs text-muted mt-1">
                            Vendido por{" "}
                            <span className="text-foreground font-medium">
                              {item.product.seller.name}
                            </span>
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
                          <div className="flex flex-col items-end gap-1.5">
                            {/* Reseña del PRODUCTO */}
                            <button
                              onClick={() =>
                                handleCreateReview(
                                  "product",
                                  item.productId,
                                  productKey
                                )
                              }
                              disabled={loadingReviewKey === productKey}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-info hover:opacity-75 transition disabled:opacity-50"
                            >
                              {loadingReviewKey === productKey ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Star className="w-3.5 h-3.5" />
                              )}
                              {loadingReviewKey === productKey
                                ? "Generando link..."
                                : "Agregar reseña del producto"}
                            </button>

                            {/* Opinión del VENDEDOR */}
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
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-info hover:opacity-75 transition disabled:opacity-50"
                              >
                                {loadingReviewKey === sellerKey ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <MessageCircle className="w-3.5 h-3.5" />
                                )}
                                {loadingReviewKey === sellerKey
                                  ? "Generando link..."
                                  : "Dejar opinión del vendedor"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">Total</p>
                  <p className="font-bold text-lg text-foreground">
                    ${pedido.total.toLocaleString("es-AR")}
                  </p>
                </div>

                {pedido.status !== "PENDING" &&
                  pedido.status !== "DELIVERED" && (
                    <button
                      onClick={() => handleTrackShipment(pedido.id)}
                      disabled={loadingOrderId === pedido.id}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-muted text-sm font-medium hover:bg-surface transition disabled:opacity-50"
                    >
                      {loadingOrderId === pedido.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Truck className="w-4 h-4" />
                      )}
                      {loadingOrderId === pedido.id
                        ? "Generando link..."
                        : "Ver estado del envío"}
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-muted font-medium hover:bg-surface transition disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {isPending ? "Cargando..." : "Ver más"}
          </button>
        </div>
      )}
    </>
  );
}