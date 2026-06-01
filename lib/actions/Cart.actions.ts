"use server";

import { auth } from "@clerk/nextjs/server";
import { getCart, addToCart, removeFromCart, clearCart, getCartCountService } from "@/lib/services/Cart.service";
import { checkUserActive } from "@/lib/services/User.service";

async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await checkUserActive(userId);

  return userId;
}

export async function getCartAction() {
  const userId = await requireUser();

  return getCart(userId);
}

export async function addToCartAction(
  productId: string,
  quantity: number,
  size: number,
  color: string
) {
  const userId = await requireUser();

  return addToCart(
    userId,
    productId,
    quantity,
    size,
    color
  );
}

export async function removeFromCartAction(
  cartItemId: string
) {
  const userId = await requireUser();

  return removeFromCart(
    userId,
    cartItemId
  );
}
export async function clearCartAction() {
  const userId = await requireUser();

  return clearCart(userId);
}

export async function getCartCount(): Promise<number> {
  const { userId } = await auth();

  if (!userId) {
    return 0;
  }

  return getCartCountService(userId);
}