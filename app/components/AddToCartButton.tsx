"use client";
import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const isLoading = loadingId === productId;
  const isAdded = addedId === productId;
  const isDisabled = isLoading || isAdded;

  async function addToCart(productId: string) {
    setLoadingId(productId);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error adding to cart:", error);
        alert("Error: " + (error.error || "No se pudo agregar al carrito"));
        setLoadingId(null);
        return;
      }

      // Actualizar el contador del carrito
      window.dispatchEvent(new Event("cartUpdated"));
      setLoadingId(null);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 2200);
    } catch (error) {
      console.error("Request failed:", error);
      alert("Error de conexión");
      setLoadingId(null);
    }
  }

  return (
    <button
      onClick={() => addToCart(productId)}
      disabled={isDisabled}
      className={`flex items-center gap-2 px-5 py-2 rounded font-medium transition-colors duration-200
        ${isAdded ? "btn-success" : "btn-primary disabled:opacity-50"}`}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {isAdded && (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {isLoading ? "Agregando..." : isAdded ? "¡Agregado!" : "Agregar al carrito"}
    </button>
  );
}