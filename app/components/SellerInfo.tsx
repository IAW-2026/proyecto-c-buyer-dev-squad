"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
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
  const { resolvedTheme } = useTheme();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [loadingReviews, setLoadingReviews] = useState(false);

  const handleViewReviews = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setLoadingReviews(true);
    try {
      const url = await getProductReviewsUrl(productId, resolvedTheme);
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
    <div className="mt-2 flex gap-2 flex-wrap items-center">
      <SellerPopover seller={seller} />
      <button
        onClick={handleViewReviews}
        disabled={loadingReviews}
        className="btn-secondary text-sm px-4 py-2 rounded-xl disabled:opacity-50"
      >
        {loadingReviews ? "Generando link..." : "Ver reseñas"}
      </button>
      <CartButton />
    </div>
  );
}