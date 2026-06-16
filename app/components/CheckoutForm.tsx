"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitCheckout } from "@/lib/actions/Checkout.actions";
import type { CheckoutFormData } from "@/lib/services/Checkout.service";
//es un tipo
import type { OrderItem } from "@/app/types/order";

type Props = {
  id: string;
  cartItems: OrderItem[];
  initialData: CheckoutFormData;
};

export default function CheckoutPage({
  id,
  cartItems,
  initialData,
}: Props) {
  const router = useRouter();
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

    if (!form.firstName.trim()) {
      next.firstName = "El nombre es requerido";
    }

    if (!form.lastName.trim()) {
      next.lastName = "El apellido es requerido";
    }

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

      if (birthDate > today) {
        next.birthDate =
          "La fecha de nacimiento no puede ser futura";
      }
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
        const { orderId } = await submitCheckout(id, cartItems, form);
        router.push(`/order-confirmation/${orderId}`);
      } catch (e) {
        console.error(e);
        setErrors({
          firstName: "Ocurrió un error. Intentá de nuevo.",
        });
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-foreground">
      <h2 className="text-2xl font-bold mb-1">Completá tus datos</h2>

      <p className="text-sm text-muted mb-8">
        Revisá que todo esté correcto antes de confirmar el pedido.
      </p>

      <section className="admin-section border-b border-muted pb-8 mb-8">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-4">
          Datos personales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              onChange={(e) =>
                setForm({
                  ...form,
                  birthDate: e.target.value,
                })
              }
              className={`admin-input w-full ${
                errors.birthDate
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
          </Field>
        </div>
      </section>

      <section className="admin-section border-b border-muted pb-8 mb-8">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-4">
          Método de entrega
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center text-center gap-1 ${
              form.deliveryType === "pickup"
                ? "border-primary bg-surface"
                : "border-muted"
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
            <span className="text-2xl">🏪</span>
            <span className="font-semibold text-sm">Retiro en sucursal</span>
            <span className="text-xs text-muted">Sin costo de envío</span>
          </label>

          <label
            className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center text-center gap-1 ${
              form.deliveryType === "delivery"
                ? "border-primary bg-surface"
                : "border-muted"
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
            <span className="text-2xl">🚚</span>
            <span className="font-semibold text-sm">Envío a domicilio</span>
            <span className="text-xs text-muted">Ingresá tu dirección</span>
          </label>
        </div>

        {form.deliveryType === "delivery" && (
          <div className="mt-4">
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

      <section className="admin-section border-b border-muted pb-8 mb-8">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-4">
          Resumen del pedido
        </h3>

        <div className="flex flex-col gap-3">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex items-center justify-between border border-muted rounded-xl p-3 bg-surface-alt"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted">
                    T.{item.size} · {item.color} · x{item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold">
                ${(item.price * item.quantity).toLocaleString("es-AR")}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 text-lg font-bold">
          <span>Total</span>
          <span>${total.toLocaleString("es-AR")}</span>
        </div>
      </section>

      <button
        className="btn-primary w-full h-12 rounded-xl font-semibold transition-opacity disabled:opacity-50"
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
      <label className={`field-label ${error ? "text-red-500" : ""}`}>
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {children}

      {error && (
        <span className="field-error flex items-center gap-1 text-red-500 text-xs mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0"
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