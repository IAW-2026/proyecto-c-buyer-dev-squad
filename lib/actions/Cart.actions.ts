"use server";

import { auth } from "@clerk/nextjs/server";
import { getCart, addToCart, removeFromCart, clearCart, getCartCountService } from "@/lib/services/Cart.service";
import { checkUserActive } from "@/lib/services/User.service";

async function requireUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  await checkUserActive(clerkId);

  return clerkId;
}

export async function getCartAction() {
  const clerkId = await requireUser();

  return getCart(clerkId);
}

export async function addToCartAction(
  productId: string,
  quantity: number,
  size: number,
  color: string
) {
  const clerkId = await requireUser();

  return addToCart(
    clerkId,
    productId,
    quantity,
    size,
    color
  );
}

export async function removeFromCartAction(
  cartItemId: string
) {
  const clerkId = await requireUser();

  return removeFromCart(
    clerkId,
    cartItemId
  );
}
export async function clearCartAction() {
  const clerkId = await requireUser();

  return clearCart(clerkId);
}

export async function getCartCount(): Promise<number> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return 0;
  }

  return getCartCountService(clerkId);
}