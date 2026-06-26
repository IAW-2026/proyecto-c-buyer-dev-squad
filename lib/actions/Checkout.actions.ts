"use server";

import { revalidatePath } from "next/cache";
import { processCheckout } from "@/lib/services/Checkout.service";
import type { OrderItem } from "@/app/types/order";
import type { CheckoutFormData } from "@/lib/services/Checkout.service";
import { checkUserActive } from "@/lib/services/User.service";
import { auth } from "@clerk/nextjs/server";

export async function submitCheckout(
  cartItems: OrderItem[],
  form: CheckoutFormData
): Promise<{ orderId: string }> {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("No autenticado");
  await checkUserActive(clerkId);

  const order = await processCheckout(
    clerkId,
    cartItems,
    form
  );

  revalidatePath("/cart");
  revalidatePath("/orders");

  return {
    orderId: order.id,
  };
}