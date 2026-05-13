"use client";

import { OrderStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "../admin/actions";
import OrderStatusBadge from "./OrderStatusBadge";

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  user: { firstName?: string | null; lastName?: string | null; email: string };
  items: {
    quantity: number;
    price: number;
    size?: number | null;
    color?: string | null;
    product: { name: string; image: string };
  }[];
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    startTransition(() => updateOrderStatus(orderId, status));
  };

  if (orders.length === 0) {
    return <div className="admin-empty">No hay pedidos para mostrar.</div>;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Items</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <>
              <tr
                key={order.id}
                className="cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
              >
                <td className="admin-table-id">#{order.id.slice(0, 8)}</td>
                <td>
                  <div>
                    <p className="font-medium">
                      {order.user.firstName ?? ""} {order.user.lastName ?? ""}
                    </p>
                    <p className="text-muted text-xs">{order.user.email}</p>
                  </div>
                </td>
                <td>
                  <span className="text-muted text-sm">
                    {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="font-semibold">
                  ${order.total.toLocaleString("es-AR")}
                </td>
                <td>
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="text-muted text-sm">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    className="admin-select"
                    defaultValue={order.status}
                    disabled={isPending}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="COMPLETED">Completado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </td>
              </tr>

              {/* Fila expandida con detalle de items */}
              {expandedId === order.id && (
                <tr key={`${order.id}-detail`} className="expanded-row">
                  <td colSpan={7}>
                    <div className="order-items-detail">
                      <p className="order-items-title">Detalle del pedido</p>
                      <div className="order-items-grid">
                        {order.items.map((item, i) => (
                          <div key={i} className="order-item-card">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="order-item-img"
                            />
                            <div>
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-muted text-xs">
                                Cant: {item.quantity}
                                {item.size ? ` · Talle: ${item.size}` : ""}
                                {item.color ? ` · Color: ${item.color}` : ""}
                              </p>
                              <p className="text-sm font-semibold">
                                ${(item.price * item.quantity).toLocaleString("es-AR")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}