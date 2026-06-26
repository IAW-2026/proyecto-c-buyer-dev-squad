"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { addToCartAction } from "@/lib/actions/Cart.actions";

type Props = {
  productId: string;
  selectedSize: number | null;
  selectedColor: string | null;
};

export default function AddToCartButton({
  productId,
  selectedSize,
  selectedColor,
}: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const isLoading = loadingId === productId;
  const isAdded = addedId === productId;
  const isDisabled =
    isLoading || isAdded || !selectedSize || !selectedColor;

  useEffect(() => {
    if (isSignedIn) {
      const pendingProduct = localStorage.getItem(
        "pendingCartProduct"
      );

      if (pendingProduct) {
        const parsed = JSON.parse(pendingProduct);

        if (
          parsed?.productId &&
          parsed?.size &&
          parsed?.color
        ) {
          addToCart(
            parsed.productId,
            parsed.size,
            parsed.color
          );
        }

        localStorage.removeItem("pendingCartProduct");
      }
    }
  }, [isSignedIn]);

  async function handleClick() {
    if (!selectedSize || !selectedColor) return;

    if (!isSignedIn) {
      localStorage.setItem(
        "pendingCartProduct",
        JSON.stringify({
          productId,
          size: selectedSize,
          color: selectedColor,
        })
      );

      openSignIn();
      return;
    }

    await addToCart(
      productId,
      selectedSize,
      selectedColor
    );
  }

  async function addToCart(
    productId: string,
    size: number,
    color: string
  ) {
    setLoadingId(productId);

    try {
      await addToCartAction(
        productId,
        1,
        size,
        color
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setAddedId(productId);

      setTimeout(() => {
        setAddedId(null);
      }, 2200);
    } catch (error) {
      console.error(error);
      alert("No se pudo agregar al carrito");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="w-full flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-full flex items-center justify-center gap-2 px-4 py-1.5 rounded font-medium text-sm transition-colors duration-200
          ${
            isAdded
              ? "btn-success"
              : "btn-primary"
          }
          disabled:opacity-40
          disabled:cursor-not-allowed`}
      >
        {isLoading
          ? "Agregando..."
          : isAdded
          ? "¡Agregado!"
          : "Agregar al carrito"}
      </button>

      {(!selectedSize || !selectedColor) && (
        <p className="text-xs text-center text-red-500">
          Seleccioná talle y color para continuar
        </p>
      )}
    </div>
  );
}