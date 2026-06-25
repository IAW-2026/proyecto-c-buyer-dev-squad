"use server";

import { auth } from "@clerk/nextjs/server";
import { generateSellerToken } from "@/lib/SellerToken";

export async function getSellerDashboardUrl(theme?: string) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("No autenticado");
  }

  const token = await generateSellerToken({
    clerkId,
  });

  const themeParam = theme ? `&theme=${encodeURIComponent(theme)}` : "";

  return `${process.env.NEXT_PUBLIC_SELLER_URL}/auth/handoff?token=${token}${themeParam}`;
}