"use server";

import { auth } from "@clerk/nextjs/server";
import { getCart, addToCart, removeFromCart } from "@/lib/services/Cart.service";

async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

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
export async function getCartCount(): Promise<number> {
const { userId } = await auth();
  if (!userId) {
    return 0;
  }
  const cart = await getCart(userId);
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}