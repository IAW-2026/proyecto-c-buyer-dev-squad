"use client";

import { useState, useTransition } from "react";
import { suspendUser, activateUser, deleteUser, updateUser } from "@/lib/services/User.service";

type User = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  createdAt: Date;
  _count: { orders: number };
};

function UserRow({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [email, setEmail] = useState(user.email);
  const [createdAt, setCreatedAt] = useState(
    new Date(user.createdAt).toISOString().slice(0, 10)
  );
  const [orderCount, setOrderCount] = useState(user._count.orders);

  const isSuspended = user.status === "SUSPENDED";

  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : null;

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase();

  const handleToggleSuspend = () => {
    startTransition(async () => {
      if (isSuspended) await activateUser(user.id);
      else await suspendUser(user.id);
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateUser(user.id, {
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        createdAt: new Date(createdAt),
        orderCount,
      });
      setEditing(false);
    });
  };

  const handleCancel = () => {
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setEmail(user.email);
    setCreatedAt(new Date(user.createdAt).toISOString().slice(0, 10));
    setOrderCount(user._count.orders);
    setEditing(false);
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteUser(user.id);
    });
  };

  return (
    <>
      <tr
        className={`transition-colors ${isSuspended ? "opacity-55" : ""} ${
          editing ? "bg-[var(--color-surface-alt)]" : "hover:bg-[var(--color-surface)]"
        }`}
      >
        {/* Avatar + nombre */}
        <td className="px-3 py-1.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-900 dark:from-zinc-300 dark:to-zinc-500 flex items-center justify-center text-white dark:text-black text-xs font-bold flex-shrink-0 select-none">
              {initials}
            </div>
            {editing ? (
              <div className="flex gap-1.5 min-w-0">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre"
                  className="w-24 px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido"
                  className="w-24 px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            ) : (
              <span className="font-medium text-[var(--color-foreground)] truncate">
                {fullName ?? (
                  <span className="text-[var(--color-muted)] italic text-xs">Sin nombre</span>
                )}
              </span>
            )}
          </div>
        </td>

        {/* Email — oculto en mobile */}
        <td className="hidden sm:table-cell px-3 py-1.5 text-[var(--color-muted)] text-xs">
          {editing ? (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          ) : (
            <span className="truncate block max-w-[180px]">{user.email}</span>
          )}
        </td>

        {/* Estado */}
        <td className="px-3 py-1.5">
          <button
            onClick={handleToggleSuspend}
            disabled={isPending}
            title={isSuspended ? "Activar usuario" : "Suspender usuario"}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none border ${
              isSuspended
                ? "bg-[var(--color-danger-light)] text-[var(--color-danger)] border-[var(--color-danger)]"
                : "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]"
            }`}
          >
            {isPending ? (
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
              </svg>
            ) : (
              <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? "bg-[var(--color-danger)]" : "bg-[var(--color-success)]"}`} />
            )}
            {isSuspended ? "Suspendido" : "Activo"}
          </button>
        </td>

        {/* Pedidos — oculto en mobile */}
        <td className="hidden sm:table-cell px-3 py-1.5">
          {editing ? (
            <input
              type="number"
              min={0}
              value={orderCount}
              onChange={(e) => setOrderCount(Number(e.target.value))}
              className="w-16 px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          ) : (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-foreground)]">
              {user._count.orders}
            </span>
          )}
        </td>

        {/* Fecha — oculto en mobile */}
        <td className="hidden md:table-cell px-3 py-1.5 text-[var(--color-muted)] text-xs">
          {editing ? (
            <input
              type="date"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              className="px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          ) : (
            new Date(user.createdAt).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          )}
        </td>

        {/* Acciones — siempre visibles */}
        <td className="px-3 py-1.5">
          <div className="flex items-center justify-end gap-1">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  title="Guardar"
                  className="p-1.5 rounded-md btn-success text-white transition-colors disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleCancel}
                  title="Cancelar"
                  className="p-1.5 rounded-md btn-secondary transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                title="Editar"
                className="p-1.5 rounded-md text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Eliminar"
              disabled={isPending}
              className="p-1.5 rounded-md text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors disabled:opacity-40"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {showDeleteConfirm && (
        <tr>
          <td colSpan={6} className="p-0">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-[var(--color-background)] rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border border-[var(--color-border)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[var(--color-danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-foreground)]">Eliminar usuario</h3>
                    <p className="text-xs text-[var(--color-muted)]">Esta acción no se puede deshacer</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-muted)] mb-5">
                  ¿Eliminar a{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {fullName ?? user.email}
                  </span>
                  ? Se borrarán todos sus datos, pedidos y carrito.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 rounded-lg btn-danger text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {isPending ? "Eliminando..." : "Sí, eliminar"}
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function UsersTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--color-muted)]">
        <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-sm">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]" style={{ WebkitOverflowScrolling: "touch" }}>
      <table className="w-full text-sm" style={{ minWidth: 320 }}>
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
            <th className="px-3 py-1.5 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Usuario</th>
            <th className="hidden sm:table-cell px-3 py-1.5 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Email</th>
            <th className="px-3 py-1.5 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Estado</th>
            <th className="hidden sm:table-cell px-3 py-1.5 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Pedidos</th>
            <th className="hidden md:table-cell px-3 py-1.5 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Registrado</th>
            <th className="px-3 py-1.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}