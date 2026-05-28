"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {getUserCheckoutData, CheckoutFormData} from "@/lib/actions/Checkout.actions";
import type { OrderItem } from "@/app/types/order";

type Props = {
  userId: string;
  cartItems: OrderItem[];
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";

  return new Date(date)
    .toISOString()
    .split("T")[0];
}

export default function CheckoutPage({
  userId,
  cartItems,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});

  const [form, setForm] =
    useState<CheckoutFormData>({
      firstName: "",
      lastName: "",
      phone: "",
      birthDate: "",
      deliveryType: "pickup",
      address: "",
    });

  useEffect(() => {
    getUserCheckoutData(userId).then((data) => {
      if (!data) return;

      setForm((prev) => ({
        ...prev,

        firstName:
          data.firstName ?? prev.firstName,

        lastName:
          data.lastName ?? prev.lastName,

        phone: data.phone ?? prev.phone,

        birthDate:
          formatDate(data.birthDate) ||
          prev.birthDate,

        address:
          data.address ?? prev.address,
      }));
    });
  }, [userId]);

  const total = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  function validate(): boolean {
    const next: typeof errors = {};

    if (!form.firstName.trim()) {
      next.firstName = "Requerido";
    }

    if (!form.lastName.trim()) {
      next.lastName = "Requerido";
    }

    if (!form.phone.trim()) {
      next.phone = "Requerido";
    } else if (
      !/^\+?[\d\s\-()]{7,}$/.test(form.phone)
    ) {
      next.phone = "Teléfono inválido";
    }

    if (!form.birthDate) {
      next.birthDate = "Requerido";
    }

    if (
      form.deliveryType === "delivery" &&
      !form.address?.trim()
    ) {
      next.address =
        "Ingresá la dirección de envío";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    startTransition(async () => {
      try {
        const response = await fetch(
          "/api/orders",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              total,
              firstName: form.firstName,
              lastName: form.lastName,
              phone: form.phone,
              deliveryType:
                form.deliveryType,
              address: form.address,
              items: cartItems,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Error al crear la orden"
          );
        }
        const data = await response.json();
        router.push(
          `/order-confirmation/${data.orderId}`
        );
      } catch (e) {
        console.error(e);

        setErrors({
          firstName:
            "Ocurrió un error. Intentá de nuevo.",
        });
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-foreground">
      <h2 className="text-2xl font-bold mb-1">
        Completá tus datos
      </h2>

      <p className="text-sm text-muted mb-8">
        Revisá que todo esté correcto antes de
        confirmar el pedido.
      </p>
      <section className="admin-section border-b border-muted pb-8 mb-8">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted mb-4">
          Datos personales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Field
            label="Nombre"
            error={errors.firstName}
            required
          >
            <input
              type="text"
              value={form.firstName}
              onChange={(e) =>
                setForm({
                  ...form,
                  firstName: e.target.value,
                })
              }
              placeholder="Juan"
              className="admin-input w-full"
            />
          </Field>

          <Field
            label="Apellido"
            error={errors.lastName}
            required
          >
            <input
              type="text"
              value={form.lastName}
              onChange={(e) =>
                setForm({
                  ...form,
                  lastName: e.target.value,
                })
              }
              placeholder="García"
              className="admin-input w-full"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Teléfono"
            error={errors.phone}
            required
          >
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              placeholder="+54 9 11 1234-5678"
              className="admin-input w-full"
            />
          </Field>

          <Field
            label="Fecha de nacimiento"
            error={errors.birthDate}
            required
          >
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  birthDate: e.target.value,
                })
              }
              className="admin-input w-full"
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
              checked={
                form.deliveryType === "pickup"
              }
              onChange={() =>
                setForm({
                  ...form,
                  deliveryType: "pickup",
                })
              }
              className="hidden"
            />

            <span className="text-2xl">
              🏪
            </span>

            <span className="font-semibold text-sm">
              Retiro en sucursal
            </span>

            <span className="text-xs text-muted">
              Sin costo de envío
            </span>
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
              checked={
                form.deliveryType ===
                "delivery"
              }
              onChange={() =>
                setForm({
                  ...form,
                  deliveryType:
                    "delivery",
                })
              }
              className="hidden"
            />

            <span className="text-2xl">
              🚚
            </span>

            <span className="font-semibold text-sm">
              Envío a domicilio
            </span>

            <span className="text-xs text-muted">
              Ingresá tu dirección
            </span>
          </label>
        </div>

        {form.deliveryType ===
          "delivery" && (
          <div className="mt-4">
            <Field
              label="Dirección de entrega"
              error={errors.address}
              required
            >
              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address:
                      e.target.value,
                  })
                }
                placeholder="Av. Corrientes 1234"
                className="admin-input w-full"
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
                  <p className="font-medium text-sm">
                    {item.name}
                  </p>

                  <p className="text-xs text-muted">
                    T.{item.size} ·{" "}
                    {item.color} · x
                    {item.quantity}
                  </p>
                </div>
              </div>

              <span className="font-semibold">
                $
                {(
                  item.price *
                  item.quantity
                ).toLocaleString("es-AR")}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 text-lg font-bold">
          <span>Total</span>

          <span>
            ${total.toLocaleString("es-AR")}
          </span>
        </div>
      </section>

      <button
        className="btn-primary w-full h-12 rounded-xl font-semibold transition-opacity disabled:opacity-50"
        onClick={handleSubmit}
        disabled={isPending}
        type="button"
      >
        {isPending
          ? "Procesando..."
          : "Confirmar y pagar"}
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
      <label
        className={`field-label ${
          required
            ? "field-label-required"
            : ""
        }`}
      >
        {label}
      </label>

      {children}

      {error && (
        <span className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}