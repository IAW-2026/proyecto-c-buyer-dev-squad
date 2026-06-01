import OrdersTable from "@/app/components/OrderStable";
import { getOrdersByStatus, getOrderStatusCounts } from "@/lib/services/Orders.service";

export default async function OrdersPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await props.searchParams;
  const result = await getOrdersByStatus(status, 1, 6);
  const counts = await getOrderStatusCounts();
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Pedidos</h1>
        <p className="admin-page-subtitle">{result.pagination.totalItems} pedidos encontrados</p>
      </div>

      <div className="status-filters">
        {[
          { label: "Todos", value: "ALL", count: Object.values(counts).reduce((a, b) => a + b, 0) },
          { label: "Pendientes", value: "PENDING", count: counts.PENDING ?? 0 },
          { label: "Pagados", value: "PAID", count: counts.PAID ?? 0 },
          { label: "Enviados", value: "SHIPPED", count: counts.SHIPPED ?? 0 },
          { label: "Entregados", value: "DELIVERED", count: counts.DELIVERED ?? 0 },
        ].map((filter) => (
          <a
            key={filter.value}
            href={`/admin/orders${filter.value !== "ALL" ? `?status=${filter.value}` : ""}`}
            className={`status-filter-btn ${
              (status ?? "ALL") === filter.value ? "active" : ""
            }`}
          >
            {filter.label}
            <span className="status-filter-count">{filter.count}</span>
          </a>
        ))}
      </div>

      <OrdersTable key={status ?? "ALL"} initialOrders={result.data} initialTotal={result.pagination.totalItems} status={status} />
    </div>
  );
}