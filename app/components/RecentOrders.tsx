import { OrderStatus } from "@prisma/client";
import OrderStatusBadge from "./OrderStatusBadge";

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  user: { firstName?: string | null; lastName?: string | null; email: string };
  items: {
    product: { name: string; image: string };
    quantity: number;
    price: number;
  }[];
}

export default function RecentOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <div className="admin-empty">No hay pedidos recientes.</div>;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
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
                <div className="flex items-center gap-1">
                  {order.items.slice(0, 2).map((item, i) => (
                    <img
                      key={i}
                      src={item.product.image}
                      alt={item.product.name}
                      className="admin-product-thumb"
                    />
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-muted text-xs">+{order.items.length - 2}</span>
                  )}
                </div>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}