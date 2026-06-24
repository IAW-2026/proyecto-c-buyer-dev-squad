
import { prisma } from "@/lib/prisma";
import type { OrderItem } from "@/app/types/order";
import { getOrCreateUser } from "./User.service";

export async function getCartItems(clerkId: string): Promise<OrderItem[]> {
  await getOrCreateUser(clerkId);
  const items = await prisma.cartItem.findMany({
    where: { userId: clerkId },
    include: { product: true },
  });
  return items.map((item) => ({
    id: item.id,
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    imageUrl: item.product.image,
    sellerId: item.product.sellerId,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
  }));
}
export async function getCart(clerkId: string) {
  await getOrCreateUser(clerkId);

  return prisma.cartItem.findMany({
    where: { userId: clerkId },
    include: { product: true },
  });
}

export async function addToCart(
  clerkId: string,
  productId: string,
  quantity: number,
  size: number,
  color: string
) {
  await getOrCreateUser(clerkId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      productId,
      userId: clerkId,
      size,
      color,
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
      include: { product: true },
    });
  }

  return prisma.cartItem.create({
    data: {
      productId,
      userId: clerkId,
      quantity,
      size,
      color,
    },
    include: { product: true },
  });
}

export async function removeFromCart(
  clerkId: string,
  cartItemId: string
) {
  await getOrCreateUser(clerkId);

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      userId: clerkId,
    },
  });

  if (!existingItem) {
    throw new Error("Cart item not found");
  }

  if (existingItem.quantity > 1) {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: existingItem.quantity - 1,
      },
    });
  }

  return prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });
}
export async function getCartSummary(clerkId: string) {
  const items = await getCartItems(clerkId);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return {
    items,
    total,
  };
}
export async function clearCart(clerkId: string) {
  await getOrCreateUser(clerkId);

  return prisma.cartItem.deleteMany({
    where: { userId: clerkId },
  });
}

export async function getCartCountService(
  clerkId: string
) {
  await getOrCreateUser(clerkId);

  const items =
    await prisma.cartItem.findMany({
      where: { userId: clerkId },
      select: { quantity: true },
    });

  return items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
}