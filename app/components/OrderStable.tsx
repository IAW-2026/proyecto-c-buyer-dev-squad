"use client";

import { useState, useTransition, useEffect } from "react";
import { updateOrder, deleteOrder, deleteOrderItem, loadMoreAdminOrders } from "@/lib/actions/Order.actions";
import { Order, OrderItem } from "@/app/types/order";
import OrderStatusBadge from "./OrderStatusBadge";

type EditableItem = OrderItem & {
  quantityStr: string;
  priceStr: string;
};

function toEditable(item: OrderItem): EditableItem {
  return { ...item, quantityStr: String(item.quantity), priceStr: String(item.price) };
}

function toLocalDateString(date: Date | string) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

//validación de mail
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(v: string) {
  if (!v.trim()) return "El email es obligatorio";
  if (!EMAIL_RE.test(v.trim())) return "Email inválido";
  return null;
}

function validateQuantity(v: string) {
  const n = parseInt(v, 10);
  if (isNaN(n) || v.trim() === "") return "Cantidad inválida";
  if (n < 1) return "Debe ser ≥ 1";
  return null;
}

function validatePrice(v: string) {
  const n = parseFloat(v);
  if (isNaN(n) || v.trim() === "") return "Precio inválido";
  if (n < 0) return "Debe ser ≥ 0";
  return null;
}

function validateDate(v: string) {
  if (!v) return "La fecha es obligatoria";
  return null;
}

function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return <span className="text-[10px] text-[var(--color-danger)] leading-tight">{msg}</span>;
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState(order.user.firstName ?? "");
  const [lastName, setLastName] = useState(order.user.lastName ?? "");
  const [email, setEmail] = useState(order.user.email);
  const [createdAt, setCreatedAt] = useState(toLocalDateString(order.createdAt));
  const [items, setItems] = useState<EditableItem[]>(order.items.map(toEditable));

  // Errores por campo
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [itemErrors, setItemErrors] = useState<{ quantity: string | null; price: string | null }[]>(
    () => order.items.map(() => ({ quantity: null, price: null }))
  );
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      setFirstName(order.user.firstName ?? "");
      setLastName(order.user.lastName ?? "");
      setEmail(order.user.email);
      setCreatedAt(toLocalDateString(order.createdAt));
      setItems(order.items.map(toEditable));
      setEditing(false);
      setExpanded(false);
      clearErrors();
    }
  }, [order]);

  const clearErrors = () => {
    setEmailError(null);
    setDateError(null);
    setItemErrors(order.items.map(() => ({ quantity: null, price: null })));
    setGlobalError(null);
  };

  // Valida todo y retorna true si es válido
  const runValidation = (): boolean => {
    let valid = true;

    const eErr = validateEmail(email);
    setEmailError(eErr);
    if (eErr) valid = false;

    const dErr = validateDate(createdAt);
    setDateError(dErr);
    if (dErr) valid = false;

    if (items.length === 0) {
      setGlobalError("El pedido debe tener al menos un producto");
      valid = false;
    } else {
      setGlobalError(null);
    }

    const newItemErrors = items.map((it) => ({
      quantity: validateQuantity(it.quantityStr),
      price: validatePrice(it.priceStr),
    }));
    setItemErrors(newItemErrors);
    if (newItemErrors.some((e) => e.quantity || e.price)) valid = false;

    return valid;
  };

  const calculatedTotal = items.reduce(
    (acc, item) => acc + (parseInt(item.quantityStr) || 0) * (parseFloat(item.priceStr) || 0),
    0
  );

  const updateItemStr = (idx: number, field: "quantityStr" | "priceStr", val: string) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
    // Limpiar error del campo modificado
    setItemErrors((prev) =>
      prev.map((e, i) =>
        i === idx
          ? { ...e, [field === "quantityStr" ? "quantity" : "price"]: null }
          : e
      )
    );
  };

  const handleSave = () => {
    if (!runValidation()) return;

    startTransition(async () => {
      await updateOrder(order.id, {
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        email: email.trim(),
        total: calculatedTotal,
        status: order.status,
        createdAt: new Date(`${createdAt}T12:00:00`),
        items: items.map((it) => ({
          quantity: parseInt(it.quantityStr, 10),
          price: parseFloat(it.priceStr),
        })),
      });
    });
  };

  const handleCancel = () => {
    setFirstName(order.user.firstName ?? "");
    setLastName(order.user.lastName ?? "");
    setEmail(order.user.email);
    setCreatedAt(toLocalDateString(order.createdAt));
    setItems(order.items.map(toEditable));
    setEditing(false);
    clearErrors();
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteOrder(order.id);
    });
  };

  const removeItem = async (idx: number) => {
    const item = items[idx];
    if (!item) return;
    startTransition(async () => {
      await deleteOrderItem(item.id);
      setItems((prev) => prev.filter((_, i) => i !== idx));
      setItemErrors((prev) => prev.filter((_, i) => i !== idx));
    });
  };

  const clientName =
    order.user.firstName || order.user.lastName
      ? `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim()
      : null;

  const hasErrors =
    !!emailError ||
    !!dateError ||
    !!globalError ||
    itemErrors.some((e) => e.quantity || e.price);

  return (
    <>
      <tr
        className={`transition-colors ${
          editing
            ? "bg-[var(--color-surface-alt)]"
            : "hover:bg-[var(--color-surface)] cursor-pointer"
        }`}
        onClick={() => !editing && setExpanded((v) => !v)}
      >
        <td className="hidden sm:table-cell px-2 py-3 font-mono text-xs text-[var(--color-muted)]">
          #{order.id.slice(0, 8)}
        </td>

        <td className="px-2 py-3">
          {editing ? (
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre"
                  onClick={(e) => e.stopPropagation()}
                  className="w-24 px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido"
                  onClick={(e) => e.stopPropagation()}
                  className="w-24 px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                placeholder="Email"
                onClick={(e) => e.stopPropagation()}
                className={`w-full px-2 py-1 text-xs rounded border bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] ${
                  emailError ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
                }`}
              />
              <FieldError msg={emailError} />
            </div>
          ) : (
            <div>
              <p className="font-medium text-[var(--color-foreground)] text-sm">
                {clientName ?? (
                  <span className="italic text-[var(--color-muted)]">Sin nombre</span>
                )}
              </p>
              <p className="text-[var(--color-muted)] text-xs">{order.user.email}</p>
            </div>
          )}
        </td>

        <td className="hidden sm:table-cell px-2 py-3 text-[var(--color-muted)] text-sm">
          {items.reduce((acc, item) => acc + (parseInt(item.quantityStr) || 0), 0)} producto
          {items.reduce((acc, item) => acc + (parseInt(item.quantityStr) || 0), 0) !== 1 ? "s" : ""}
        </td>

        <td className="px-2 py-3 font-semibold text-[var(--color-foreground)]">
          ${calculatedTotal.toLocaleString("es-AR")}
        </td>

        <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
          <OrderStatusBadge status={order.status} />
        </td>

        <td className="hidden md:table-cell px-2 py-3 text-[var(--color-muted)] text-sm">
          {editing ? (
            <div className="flex flex-col gap-0.5">
              <input
                type="date"
                value={createdAt}
                onChange={(e) => { setCreatedAt(e.target.value); setDateError(null); }}
                onClick={(e) => e.stopPropagation()}
                className={`px-2 py-1 text-xs rounded border bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] ${
                  dateError ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
                }`}
              />
              <FieldError msg={dateError} />
            </div>
          ) : (
            toLocalDateString(order.createdAt).split("-").reverse().join("/")
          )}
        </td>

        <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-1">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isPending || hasErrors}
                  title={hasErrors ? "Corregí los errores antes de guardar" : "Guardar"}
                  className="p-1.5 rounded-md btn-success transition-colors disabled:opacity-50"
                >
                  {isPending ? (
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
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
              <>
                <button
                  onClick={() => { setEditing(true); setExpanded(true); }}
                  title="Editar"
                  className="p-1.5 rounded-md text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
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
              </>
            )}
          </div>
        </td>
      </tr>

      {(expanded || editing) && (
        <tr className="bg-[var(--color-surface-alt)]">
          <td colSpan={7} className="px-4 pb-4 pt-0">
            <div className="border-t border-[var(--color-border)] pt-3">
              <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                Detalle del pedido
              </p>

              {/* Error global (ej: sin items) */}
              {globalError && (
                <p className="text-xs text-[var(--color-danger)] mb-2">{globalError}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-[var(--color-foreground)] truncate">
                        {item.name}
                      </p>
                      <p className="text-[var(--color-muted)] text-xs">
                        {item.size ? `Talle: ${item.size}` : ""}
                        {item.size && item.color ? " · " : ""}
                        {item.color ? `Color: ${item.color}` : ""}
                      </p>
                      {editing ? (
                        <div className="flex flex-col gap-1 mt-1.5">
                          <div className="flex gap-2">
                            <label className="flex flex-col gap-0.5 text-xs text-[var(--color-muted)]">
                              <span>Cant.</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={item.quantityStr}
                                onChange={(e) => updateItemStr(i, "quantityStr", e.target.value)}
                                className={`w-12 px-1.5 py-0.5 rounded border bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] ${
                                  itemErrors[i]?.quantity
                                    ? "border-[var(--color-danger)]"
                                    : "border-[var(--color-border)]"
                                }`}
                              />
                              <FieldError msg={itemErrors[i]?.quantity ?? null} />
                            </label>
                            <label className="flex flex-col gap-0.5 text-xs text-[var(--color-muted)]">
                              <span>Precio $</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={item.priceStr}
                                onChange={(e) => updateItemStr(i, "priceStr", e.target.value)}
                                className={`w-20 px-1.5 py-0.5 rounded border bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] ${
                                  itemErrors[i]?.price
                                    ? "border-[var(--color-danger)]"
                                    : "border-[var(--color-border)]"
                                }`}
                              />
                              <FieldError msg={itemErrors[i]?.price ?? null} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-[var(--color-foreground)]">
                          {item.quantity}× ${item.price.toLocaleString("es-AR")}
                          <span className="text-[var(--color-muted)] font-normal">
                            {" "}= ${(item.price * item.quantity).toLocaleString("es-AR")}
                          </span>
                        </p>
                      )}
                    </div>
                    {editing && (
                      <button
                        onClick={() => removeItem(i)}
                        title="Eliminar producto"
                        className="p-1.5 rounded-md text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors flex-shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}

      {showDeleteConfirm && (
        <tr>
          <td colSpan={7} className="p-0">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-[var(--color-background)] rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border border-[var(--color-border)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[var(--color-danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-foreground)]">Eliminar pedido</h3>
                    <p className="text-xs text-[var(--color-muted)]">Esta acción no se puede deshacer</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-muted)] mb-5">
                  ¿Eliminar el pedido{" "}
                  <span className="font-semibold text-[var(--color-foreground)] font-mono">
                    #{order.id.slice(0, 8)}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {clientName ?? order.user.email}
                  </span>
                  ?
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

export default function OrdersTable({
  initialOrders,
  initialTotal,
  status,
}: {
  initialOrders: Order[];
  initialTotal: number;
  status?: string;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrders(initialOrders);
    setPage(1);
  }, [initialOrders]);

  const hasMore = orders.length < initialTotal;

  const loadMore = () => {
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await loadMoreAdminOrders(status ?? null, nextPage);
      setOrders((prev) => [...prev, ...result.data]);
      setPage(nextPage);
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--color-muted)]">
        <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">No hay pedidos para mostrar.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]" style={{ WebkitOverflowScrolling: "touch" }}>
        <table className="w-full text-sm" style={{ minWidth: 320 }}>
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
              <th className="hidden sm:table-cell px-2 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">ID</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Cliente</th>
              <th className="hidden sm:table-cell px-2 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Items</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Total</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Estado</th>
              <th className="hidden md:table-cell px-2 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">Fecha</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-2 border border-[var(--color-border)] rounded-full text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
          >
            {isPending ? "Cargando..." : "Ver más"}
          </button>
        </div>
      )}
    </>
  );
}