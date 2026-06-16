
import { prisma } from "@/lib/prisma";
import type { OrderItem } from "@/app/types/order";
import { getOrCreateUser } from "./User.service";

export async function getCartItems(clerkId: string): Promise<OrderItem[]> {
  const user = await getOrCreateUser(clerkId);
  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
  return items.map((item) => ({
    id: item.id,
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
  }));
}
export async function getCart(clerkId: string) {
  const user = await getOrCreateUser(clerkId);

  return prisma.cartItem.findMany({
    where: { userId: user.id },
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
  const user = await getOrCreateUser(clerkId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      productId,
      userId: user.id,
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
      userId: user.id,
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
  const user = await getOrCreateUser(clerkId);

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      userId: user.id,
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
  const user = await getOrCreateUser(clerkId);

  return prisma.cartItem.deleteMany({
    where: { userId: user.id },
  });
}

export async function getCartCountService(
  clerkId: string
) {
  const user = await getOrCreateUser(
    clerkId
  );

  const items =
    await prisma.cartItem.findMany({
      where: { userId: user.id },
      select: { quantity: true },
    });

  return items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
}