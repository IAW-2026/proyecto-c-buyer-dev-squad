"use server";

import { auth } from "@clerk/nextjs/server";
import { generateShipmentToken } from "../shipmentToken";

/**
 * Genera un token firmado para que el usuario vea el detalle de su envío
 * en la app de shipping sin tener que loguearse de nuevo ahí.
 *
 * Se llama justo en el momento del click (no antes), así el token
 * siempre llega fresco y nunca alcanza a vencer (TTL 180s) en el
 * flujo normal de uso.
 *
 * Devuelve la URL completa ya armada con el token, lista para redirigir.
 */
export async function getShipmentTrackingUrl(orderId: string): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("No autenticado");
  }

  const token = await generateShipmentToken({ userId, orderId });

  return `${process.env.NEXT_PUBLIC_SHIPPING_URL}/dashboard/shipments/${orderId}?token=${token}`;
}
