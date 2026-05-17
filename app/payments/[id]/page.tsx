"use client";

import { useRouter } from "next/navigation";
import { useState, use} from "react";

export default function PaymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/payments/${id}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Payment failed");
      }

      router.push(
        `/order-confirmation/${id}`
      );
    } catch (error) {
      console.error(error);
      alert("Error processing payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-surface-alt border border-muted rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">
          Proceder al pago
        </h1>

        <p className="text-muted mb-6">
          Simulación del proceso de pago para la orden #
          {id}
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full btn-success py-3 rounded-lg font-bold"
        >
          {loading
            ? "Procesando..."
            : "Confirmar Pago"}
        </button>
      </div>
    </main>
  );
}