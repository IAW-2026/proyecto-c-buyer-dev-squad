"use server";

import { auth } from "@clerk/nextjs/server";
import { generateSellerToken } from "@/lib/SellerToken";

export async function getSellerDashboardUrl() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autenticado");
  }

  const token = await generateSellerToken({
    userId,
  });

  return `${process.env.NEXT_PUBLIC_SELLER_URL}/auth/handoff?token=${token}`;
}