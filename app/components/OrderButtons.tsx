"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { clearCartAction } from "@/lib/actions/Cart.actions";

export default function OrderButtons() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleContinueShopping = () => {
    startTransition(async () => {
      await clearCartAction();
      router.push("/");
    });
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleContinueShopping}
        disabled={isPending}
        className="flex-1 btn-info font-bold py-2 px-4 rounded-lg text-center transition disabled:opacity-50"
      >
        {isPending ? "Cargando..." : "Seguir Comprando"}
      </button>
      <button
        onClick={() => router.push("/cart")}
        className="flex-1 btn-secondary font-bold py-2 px-4 rounded-lg text-center transition"
      >
        Ver Carrito
      </button>
    </div>
  );
}
