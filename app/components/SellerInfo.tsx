"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Seller } from "../types/seller";
import { SellerPopover } from "./SellerPopover";
import CartButton from "./CartButton";
import { getProductReviewsUrl } from "@/lib/actions/handoff.actions";

export default function SellerInfo({
  seller,
  productId,
}: {
  seller: Seller;
  productId: string;
}) {
  const router = useRouter();
  const [loadingReviews, setLoadingReviews] = useState(false);

  const handleViewReviews = async () => {
    setLoadingReviews(true);
    try {
      const url = await getProductReviewsUrl(productId);
      router.push(url);
    } catch (err) {
      console.error("No se pudo generar el link de reseñas:", err);
      // Fallback: misma página, sin token.
      router.push(
        `${process.env.NEXT_PUBLIC_FEEDBACK_URL}/explorar/producto/${productId}`
      );
    } finally {
      setLoadingReviews(false);
    }
  };

  return (
    <div className="mt-auto flex gap-3 flex-wrap items-center">
      <SellerPopover seller={seller} />
      <button
        onClick={handleViewReviews}
        disabled={loadingReviews}
        className="btn-secondary text-sm px-4 py-2 rounded-xl disabled:opacity-50"
      >
        {loadingReviews ? "Generando link..." : "⭐ Ver reseñas"}
      </button>
      <CartButton />
    </div>
  );
}