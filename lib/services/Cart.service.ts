
import { prisma } from "@/lib/prisma";
import type { OrderItem } from "@/app/types/order";

export async function getCartItems(clerkId: string): Promise<OrderItem[]> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });
  if (!user) return [];
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