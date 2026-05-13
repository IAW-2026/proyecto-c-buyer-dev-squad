import { prisma } from "@/lib/prisma";
import StatsCard from "../components/StatsCard";
import RecentOrders from "../components/RecentOrders";
import { Package, Users, ShoppingBag, TrendingUp } from "lucide-react";

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
    where: { status: "COMPLETED" },
  });

  const pendingOrders = await prisma.order.count({
    where: { status: "PENDING" },
  });

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    revenue: revenue._sum.total ?? 0,
    pendingOrders,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Resumen general de tu tienda</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Usuarios"
          value={stats.totalUsers}
          icon={<Users size={20} />}
          color="info"
        />
        <StatsCard
          title="Pedidos Totales"
          value={stats.totalOrders}
          icon={<ShoppingBag size={20} />}
          color="success"
          badge={stats.pendingOrders > 0 ? `${stats.pendingOrders} pendientes` : undefined}
        />
        <StatsCard
          title="Productos"
          value={stats.totalProducts}
          icon={<Package size={20} />}
          color="primary"
        />
        <StatsCard
          title="Ingresos"
          value={`$${stats.revenue.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`}
          icon={<TrendingUp size={20} />}
          color="danger"
        />
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Pedidos Recientes</h2>
        <RecentOrders orders={stats.recentOrders} />
      </div>
    </div>
  );
}