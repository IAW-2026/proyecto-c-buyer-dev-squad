"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { submitCheckout } from "@/lib/actions/Checkout.actions";
import type { CheckoutFormData } from "@/lib/services/Checkout.service";
import type { OrderItem } from "@/app/types/order";

type Props = {
  cartItems: OrderItem[];
  initialData: CheckoutFormData;
  paymentsApiUrl?: string;
};

export default function CheckoutPage({
  cartItems,
  initialData,
  paymentsApiUrl,
}: Props) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const [form, setForm] = useState<CheckoutFormData>({
    firstName: initialData.firstName ?? "",
    lastName: initialData.lastName ?? "",
    phone: initialData.phone ?? "",
    birthDate: initialData.birthDate ?? "",
    deliveryType: initialData.deliveryType ?? "pickup",
    address: initialData.address ?? "",
  });

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  function validate(): boolean {
    const next: typeof errors = {};

    if (!form.firstName.trim()) next.firstName = "El nombre es requerido";
    if (!form.lastName.trim()) next.lastName = "El apellido es requerido";

    if (!form.phone.trim()) {
      next.phone = "El teléfono es requerido";
    } else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) {
      next.phone = "El formato del teléfono no es válido";
    }

    if (!form.birthDate) {
      next.birthDate = "La fecha de nacimiento es requerida";
    } else {
      const birthDate = new Date(form.birthDate);
      const today = new Date();
      if (birthDate > today) next.birthDate = "La fecha de nacimiento no puede ser futura";
    }

    if (form.deliveryType === "delivery" && !form.address?.trim()) {
      next.address = "Ingresá la dirección de envío";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    startTransition(async () => {
      try {
        const { orderId } = await submitCheckout(cartItems, form);
        if (paymentsApiUrl) {
          const { getPaymentsUrl } = await import("@/lib/actions/Payments.action");
          const url = await getPaymentsUrl(orderId, resolvedTheme);
          window.location.href = url;
        } else {
          router.push(`/order-confirmation/${orderId}`);
        }
      } catch (e) {
        console.error(e);
        setErrors({ firstName: "Ocurrió un error. Intentá de nuevo." });
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 text-foreground">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Volver al carrito
        </button>
        <span className="text-muted/40 select-none">|</span>
        <h2 className="text-lg font-bold">Completá tus datos</h2>
      </div>

      {/* Datos personales */}
      <section className="border-b border-muted pb-4 mb-4">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-2">
          Datos personales
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <Field label="Nombre" error={errors.firstName} required>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Juan"
              className={`admin-input w-full ${errors.firstName ? "border-red-500 focus:ring-red-500" : ""}`}
            />
          </Field>
          <Field label="Apellido" error={errors.lastName} required>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="García"
              className={`admin-input w-full ${errors.lastName ? "border-red-500 focus:ring-red-500" : ""}`}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Teléfono" error={errors.phone} required>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+54 9 11 1234-5678"
              className={`admin-input w-full ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
            />
          </Field>
          <Field label="Fecha de nacimiento" error={errors.birthDate} required>
            <input
              type="date"
              value={form.birthDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className={`admin-input w-full ${errors.birthDate ? "border-red-500 focus:ring-red-500" : ""}`}
            />
          </Field>
        </div>
      </section>

      {/* Método de entrega */}
      <section className="border-b border-muted pb-4 mb-4">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-2">
          Método de entrega
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <label
            className={`border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center text-center gap-0.5 ${
              form.deliveryType === "pickup" ? "border-primary bg-surface" : "border-muted"
            }`}
          >
            <input
              type="radio"
              name="deliveryType"
              value="pickup"
              checked={form.deliveryType === "pickup"}
              onChange={() => setForm({ ...form, deliveryType: "pickup" })}
              className="hidden"
            />
            <svg className="w-6 h-6 text-[var(--color-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
            <span className="font-semibold text-xs">Retiro en sucursal</span>
            <span className="text-xs text-muted">Sin costo</span>
          </label>

          <label
            className={`border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center text-center gap-0.5 ${
              form.deliveryType === "delivery" ? "border-primary bg-surface" : "border-muted"
            }`}
          >
            <input
              type="radio"
              name="deliveryType"
              value="delivery"
              checked={form.deliveryType === "delivery"}
              onChange={() => setForm({ ...form, deliveryType: "delivery" })}
              className="hidden"
            />
            <svg className="w-6 h-6 text-[var(--color-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span className="font-semibold text-xs">Envío a domicilio</span>
            <span className="text-xs text-muted">Ingresá tu dirección</span>
          </label>
        </div>

        {form.deliveryType === "delivery" && (
          <div className="mt-2">
            <Field label="Dirección de entrega" error={errors.address} required>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Av. Corrientes 1234"
                className={`admin-input w-full ${errors.address ? "border-red-500 focus:ring-red-500" : ""}`}
              />
            </Field>
          </div>
        )}
      </section>

      {/* Resumen del pedido */}
      <section className="border-b border-muted pb-4 mb-4">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-2">
          Resumen del pedido
        </h3>

        <div className="flex flex-col gap-2">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex items-center justify-between border border-muted rounded-xl p-2 bg-surface-alt"
            >
              <div className="flex items-center gap-2">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-xs">{item.name}</p>
                  <p className="text-xs text-muted">
                    T.{item.size} · {item.color} · x{item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-sm">
                ${(item.price * item.quantity).toLocaleString("es-AR")}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3 text-base font-bold">
          <span>Total</span>
          <span>${total.toLocaleString("es-AR")}</span>
        </div>
      </section>

      <button
        className="btn-primary w-full h-11 rounded-xl font-semibold transition-opacity disabled:opacity-50"
        onClick={handleSubmit}
        disabled={isPending}
        type="button"
      >
        {isPending ? "Procesando..." : "Confirmar y pagar"}
      </button>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="field-wrapper">
      <label className={`field-label text-xs ${error ? "text-red-500" : ""}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {error && (
        <span className="field-error flex items-center gap-1 text-red-500 text-xs mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}