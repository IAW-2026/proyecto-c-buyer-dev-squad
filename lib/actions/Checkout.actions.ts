"use server";

import { revalidatePath } from "next/cache";
import { processCheckout } from "@/lib/services/Checkout.service";
import type { OrderItem } from "@/app/types/order";
import type { CheckoutFormData } from "@/lib/services/Checkout.service";

export async function submitCheckout(
  userId: string,
  cartItems: OrderItem[],
  form: CheckoutFormData
): Promise<{ orderId: string }> {
  const order = await processCheckout(
    userId,
    cartItems,
    form
  );

  revalidatePath("/cart");
  revalidatePath("/orders");

  return {
    orderId: order.id,
  };
}