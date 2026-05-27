import { prisma } from "@/lib/prisma";
import OrdersTable from "@/app/components/OrderStable";

async function getOrders(status?: string) {
  return prisma.order.findMany({
    where: status && status !== "ALL" ? { status: status as any } : undefined,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function OrdersPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await props.searchParams;
  const orders = await getOrders(status);

  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  const counts = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count])
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Pedidos</h1>
        <p className="admin-page-subtitle">{orders.length} pedidos encontrados</p>
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

      <OrdersTable orders={orders} />
    </div>
  );
}