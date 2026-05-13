"use client";

import { useTransition } from "react";
import { updateUserRole } from "../admin/actions";

interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  _count: { orders: number };
}

export default function UsersTable({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (userId: string, role: "USER" | "ADMIN") => {
    startTransition(() => updateUserRole(userId, role));
  };

  if (users.length === 0) {
    return <div className="admin-empty">No se encontraron usuarios.</div>;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Pedidos</th>
            <th>Rol</th>
            <th>Registrado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-cell">
                  <div className="user-avatar">
                    {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                  </div>
                  <span className="font-medium">
                    {user.firstName ?? ""} {user.lastName ?? ""}
                  </span>
                </div>
              </td>
              <td className="text-muted text-sm">{user.email}</td>
              <td>
                <span className="admin-badge badge-info">
                  {user._count.orders} pedido{user._count.orders !== 1 ? "s" : ""}
                </span>
              </td>
              <td>
                <span
                  className={`admin-badge ${
                    user.role === "ADMIN" ? "badge-completed" : "badge-pending"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="text-muted text-sm">
                {new Date(user.createdAt).toLocaleDateString("es-AR")}
              </td>
              <td>
                <select
                  className="admin-select"
                  defaultValue={user.role}
                  disabled={isPending}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value as "USER" | "ADMIN")
                  }
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}