"use client";
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const isLoading = loadingId === productId;
  const isAdded = addedId === productId;
  const isDisabled = isLoading || isAdded;
  
  useEffect(() => {
    if (isSignedIn) {
      const pendingProduct = localStorage.getItem("pendingCartProduct");
  
      if (pendingProduct) {
        addToCart(pendingProduct);
  
        // limpiamos para que no se repita
        localStorage.removeItem("pendingCartProduct");
      }
    }
  }, [isSignedIn]);
  async function handleClick() {
    if (!isSignedIn) {
      localStorage.setItem("pendingCartProduct", productId); //guardamos el producto que se quería agregar 
      // para después de loguearse
      openSignIn(); // si no está logueado abre el modal de login
      return;
    }
    addToCart(productId);
  }
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
        alert("Error: " + (error.error || "No se pudo agregar al carrito"));
        setLoadingId(null);
        return;
      }

      window.dispatchEvent(new Event("cartUpdated"));
      setLoadingId(null);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 2200);
    } catch (error) {
      alert("Error de conexión");
      setLoadingId(null);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`w-full flex items-center justify-center gap-2 px-5 py-2 rounded font-medium transition-colors duration-200
        ${isAdded ? "btn-success" : "btn-primary disabled:opacity-50"}`}
    >
      {isLoading ? "Agregando..." : isAdded ? "¡Agregado!" : "Agregar al carrito"}
    </button>
  );
}