import StatsCard from "../components/StatsCard";
import RecentOrders from "../components/RecentOrders";
import { Package, Users, ShoppingBag, TrendingUp } from "lucide-react";
import SalesChart from "../components/SalesChart";
import TopProductsTable from "../components/TopProductsTable";
import TopCustomerTable from "../components/TopCustomerTable";
import { getDashboardStats } from "@/lib/services/Dashboard.service";

export const dynamic = "force-dynamic";

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
          <TopProductsTable
          products={stats.topProducts}
        />
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
         <TopCustomerTable
          sellers={stats.topSellers}
        />
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