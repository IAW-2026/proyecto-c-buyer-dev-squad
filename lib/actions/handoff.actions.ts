"use server";

import { auth } from "@clerk/nextjs/server";
import { generateToken } from "@/lib/handoffToken";

// Buyer App — link a crear reseña (producto o vendedor)
export async function getCreateReviewUrl(
  tipo: "product" | "seller",
  targetId: string,
  productId?: string,
  theme?: string
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("No autenticado");

  const secret =
    tipo === "product"
      ? process.env.API_KEY_BUYER_APP!
      : process.env.API_KEY_SELLER_APP!;

  const token = await generateToken(secret, { clerkId, targetId, productId });

  const productParam = productId && tipo === "seller"
    ? `&productId=${encodeURIComponent(productId)}`
    : "";
  const themeParam = theme ? `&theme=${encodeURIComponent(theme)}` : "";

  return `${process.env.NEXT_PUBLIC_FEEDBACK_URL}/dashboard/crear-resena?tipo=${tipo}&id=${targetId}&token=${token}${productParam}${themeParam}`;
}

// Buyer App — link a ver las opiniones de un vendedor
export async function getSellerReviewsUrl(
  sellerId: string,
  productId?: string,
  theme?: string
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("No autenticado");

  const secret = process.env.API_KEY_SELLER_APP!;
  const token = await generateToken(secret, { clerkId, targetId: sellerId, productId });

  const productParam = productId
    ? `&productId=${encodeURIComponent(productId)}`
    : "";
  const themeParam = theme ? `&theme=${encodeURIComponent(theme)}` : "";
  return `${process.env.NEXT_PUBLIC_FEEDBACK_URL}/explorar/vendedor/${sellerId}?token=${token}${productParam}${themeParam}`;
}

// Buyer App — link a ver las reseñas de un producto
export async function getProductReviewsUrl(productId: string, theme?: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("No autenticado");

  const token = await generateToken(process.env.API_KEY_BUYER_APP!, {
    clerkId,
    targetId: productId,
  });

  const themeParam = theme ? `&theme=${encodeURIComponent(theme)}` : "";

  return `${process.env.NEXT_PUBLIC_FEEDBACK_URL}/explorar/producto/${productId}?token=${token}${themeParam}`;
}