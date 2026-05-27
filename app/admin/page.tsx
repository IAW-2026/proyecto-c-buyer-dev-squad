import { prisma } from "@/lib/prisma";
import StatsCard from "../components/StatsCard";
import RecentOrders from "../components/RecentOrders";
import { Package, Users, ShoppingBag, TrendingUp } from "lucide-react";
import SalesChart from "../components/SalesChart";
async function getDashboardStats() {
  const [totalUsers, totalOrders, totalProducts, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { include: { product: { select: { name: true, image: true } } } },
        },
      }),
    ]);

  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: "PAID" },
  });

  const pendingOrders = await prisma.order.count({
    where: { status: "PENDING" },
  });

  // Productos más vendidos
  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const topProducts = (
  await Promise.all(
    topProductsRaw.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, image: true, price: true },
      });
      if (!product) return null;
      return { ...product, totalSold: item._sum.quantity ?? 0 };
    })
  )
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  // Usuarios con más órdenes
  const topSellersRaw = await prisma.order.groupBy({
    by: ["userId"],
    _count: { id: true },
    _sum: { total: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const topSellers = (
  await Promise.all(
    topSellersRaw.map(async (item) => {
      const user = await prisma.user.findUnique({
        where: { id: item.userId },
        select: { firstName: true, lastName: true, email: true },
      });
      if (!user) return null;
      return {
        ...user,
        totalOrders: item._count.id,
        totalSpent: item._sum.total ?? 0,
      };
    })
  )
  ).filter((s): s is NonNullable<typeof s> => s !== null);
  // Ventas por día (últimos 30 días)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesByDay = await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: { total: true },
    _count: { id: true },
    where: {
      status: "PAID",
      createdAt: { gte: thirtyDaysAgo },
    },
    orderBy: { createdAt: "asc" },
  });

  // agrupar por fecha sin hora
  const salesMap = new Map<string, { revenue: number; orders: number }>();
  for (const entry of salesByDay) {
    const dateKey = entry.createdAt.toISOString().split("T")[0];
    const existing = salesMap.get(dateKey) ?? { revenue: 0, orders: 0 };
    salesMap.set(dateKey, {
      revenue: existing.revenue + (entry._sum.total ?? 0),
      orders: existing.orders + entry._count.id,
    });
  }

  // Rellenar días sin ventas
  const dailySales: { date: string; revenue: number; orders: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailySales.push({
      date: key,
      revenue: salesMap.get(key)?.revenue ?? 0,
      orders: salesMap.get(key)?.orders ?? 0,
    });
  }
  return {
    totalUsers,
    totalOrders,
    totalProducts,
    revenue: revenue._sum.total ?? 0,
    pendingOrders,
    recentOrders,
    topProducts,
    topSellers,
    dailySales,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
  <div className="admin-page">
  <div className="admin-page-header">
    <h1 className="admin-page-title">Dashboard</h1>
    <p className="admin-page-subtitle">
      Resumen general de tu tienda
    </p>
  </div>

  <div className="stats-grid">
    <StatsCard
      title="Usuarios"
      value={stats.totalUsers}
      icon={<Users size={16} />}
      color="info"
    />

    <StatsCard
      title="Pedidos"
      value={stats.totalOrders}
      icon={<ShoppingBag size={16} />}
      color="success"
      badge={
        stats.pendingOrders > 0
          ? `${stats.pendingOrders} pendientes`
          : undefined
      }
    />

    <StatsCard
      title="Productos"
      value={stats.totalProducts}
      icon={<Package size={16} />}
      color="primary"
    />

    <StatsCard
      title="Ingresos"
      value={`$${stats.revenue.toLocaleString("es-AR", {
        minimumFractionDigits: 0,
      })}`}
      icon={<TrendingUp size={16} />}
      color="danger"
    />
  </div>

  <div className="admin-section">
    <SalesChart data={stats.dailySales} />
  </div>

  <div className="dashboard-analysis-grid">
    <div className="admin-section">
      <h2 className="admin-section-title">
        Productos más vendidos
      </h2>

      <div className="admin-table-wrapper">
        {stats.topProducts.length === 0 ? (
          <p className="admin-empty">
            Sin datos de ventas aún.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Vendidos</th>
              </tr>
            </thead>

            <tbody>
              {stats.topProducts.map((p, i) => (
                <tr key={i}>
                  <td>
                    <span className="rank-badge">
                      {i + 1}
                    </span>
                  </td>

                  <td>
                    <div className="user-cell">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name ?? ""}
                          className="admin-product-thumb"
                        />
                      )}

                      <span>{p.name}</span>
                    </div>
                  </td>

                  <td className="text-muted">
                    ${p.price?.toLocaleString("es-AR") ?? "—"}
                  </td>

                  <td>
                    <div className="sold-bar-cell">
                      <span className="sold-count">
                        {p.totalSold}
                      </span>

                      <div className="sold-bar-track">
                        <div
                          className="sold-bar-fill"
                          style={{
                            width: `${Math.min(
                              100,
                              (p.totalSold /
                                (stats.topProducts[0]
                                  ?.totalSold || 1)) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    <div className="admin-section">
      <h2 className="admin-section-title">
        Clientes con más pedidos
      </h2>

      <div className="admin-table-wrapper">
        {stats.topSellers.length === 0 ? (
          <p className="admin-empty">
            Sin datos de clientes aún.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Pedidos</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {stats.topSellers.map((s, i) => {
                const initials = `${s.firstName?.[0] ?? ""}${
                  s.lastName?.[0] ?? ""
                }`.toUpperCase();

                return (
                  <tr key={i}>
                    <td>
                      <span className="rank-badge">
                        {i + 1}
                      </span>
                    </td>

                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {initials || "?"}
                        </div>

                        <div>
                          <div className="customer-name">
                            {s.firstName} {s.lastName}
                          </div>

                          <div className="customer-email">
                            {s.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="admin-badge badge-info">
                        {s.totalOrders}
                      </span>
                    </td>

                    <td className="customer-total">
                      ${s.totalSpent.toLocaleString("es-AR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>

  <div className="admin-section">
    <h2 className="admin-section-title">
      Pedidos recientes
    </h2>

    <RecentOrders orders={stats.recentOrders} />
  </div>
</div>
  );
}