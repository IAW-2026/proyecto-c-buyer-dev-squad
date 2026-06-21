"use server";

import { auth } from "@clerk/nextjs/server";
import { generateToken } from "@/lib/handoffToken";

// Buyer App — link a crear reseña (producto o vendedor)
export async function getCreateReviewUrl(
  tipo: "product" | "seller",
  targetId: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const secret =
    tipo === "product"
      ? process.env.API_KEY_BUYER_APP!
      : process.env.API_KEY_SELLER_APP!;

  const token = await generateToken(secret, { userId, targetId });

  return `https://feedback-app.vercel.app/dashboard/crear-resena?tipo=${tipo}&id=${targetId}&token=${token}`;
}

// Buyer App — link a ver las opiniones de un vendedor
export async function getSellerReviewsUrl(sellerId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const secret = process.env.API_KEY_SELLER_APP!;
  const token = await generateToken(secret, { userId, targetId: sellerId });

  return `https://feedback-app.vercel.app/explorar/vendedor/${sellerId}?token=${token}`;
}

// Buyer App — link a ver las reseñas de un producto
export async function getProductReviewsUrl(productId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const token = await generateToken(process.env.API_KEY_BUYER_APP!, {
    userId,
    targetId: productId,
  });

  return `https://feedback-app.vercel.app/explorar/producto/${productId}?token=${token}`;
}