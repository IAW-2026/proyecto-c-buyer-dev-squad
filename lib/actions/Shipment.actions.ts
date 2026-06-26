"use server";

import { auth } from "@clerk/nextjs/server";
import { generateShipmentToken } from "../shipmentToken";

export async function getShipmentTrackingUrl(orderId: string, theme?: string): Promise<string> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("No autenticado");
  }

  const token = await generateShipmentToken({ clerkId, orderId });

  const themeParam = theme ? `&theme=${encodeURIComponent(theme)}` : "";

  return `${process.env.NEXT_PUBLIC_SHIPPING_URL}/dashboard/shipments/${orderId}?token=${token}${themeParam}`;
}
