import { OrderStatus } from "@/generated/prisma/client";
const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "badge-pending" },
  COMPLETED: { label: "Completado", className: "badge-completed" },
  CANCELLED: { label: "Cancelado", className: "badge-cancelled" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = statusConfig[status];
  return <span className={`admin-badge ${className}`}>{label}</span>;
}