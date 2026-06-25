"use client";

import { useRouter } from "next/navigation";

export default function OrderButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-4">
      <button
        onClick={() => router.push("/")}
        className="flex-1 btn-info font-bold py-2 px-4 rounded-lg text-center transition"
      >
        Volver al inicio
      </button>
    </div>
  );
}
