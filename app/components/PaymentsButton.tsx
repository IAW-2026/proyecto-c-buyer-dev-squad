"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentsButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);
      const res = await fetch(`/api/payments/${orderId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Payment failed");
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Error processing payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full btn-success py-3 rounded-lg font-bold"
    >
      {loading ? "Procesando..." : "Confirmar Pago"}
    </button>
  );
}
