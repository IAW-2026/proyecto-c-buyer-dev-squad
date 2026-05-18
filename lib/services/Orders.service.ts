import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/app/types/order";
import { OrderItem } from "@/app/types/order";

export interface GetOrdersParams {
  userId: string;
  orderId?: string;
  status?: OrderStatus;
  page: number;
  limit: number;
}

export async function createOrder(userId: string, items: OrderItem[], total: number) {
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "PENDING",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
      },
    },
    include: { items: true },
  });

  await prisma.cartItem.deleteMany({ where: { userId } });

  return order;
}

export async function getOrders({ userId, orderId, status, page, limit }: GetOrdersParams) {
  if (orderId) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: true } } },
    });
    return order ?? null;
  }

  const where = { userId, ...(status && { status }) };

  const [totalItems, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    data: orders,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
}