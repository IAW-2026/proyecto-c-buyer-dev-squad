import { OrderStatus } from "@/generated/prisma/client";
const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendiente",
    className: "badge-pending",
  },

  PAID: {
    label: "Pagado",
    className: "badge-completed",
  },

  SHIPPED: {
    label: "Enviado",
    className: "badge-shipped",
  },

  DELIVERED: {
    label: "Entregado",
    className: "badge-delivered",
  },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = statusConfig[status];
  return <span className={`admin-badge ${className}`}>{label}</span>;
}