import { prisma } from "@/lib/prisma";
import { OrderItem, OrderStatusType } from "@/app/types/order";
import { getOrCreateUser, getUserByClerkId } from "./User.service";
import { clearCartByUserId } from "./Cart.service";

type GetOrdersParams = {
  clerkId?: string;
  orderId?: string;
  status?: OrderStatusType;
  page: number;
  limit: number;
};

export async function createOrder(
  clerkId: string,
  items: OrderItem[],
  total: number,
  firstName: string,
  lastName: string,
  phone: string,
  deliveryType: string,
  address?: string
) {
  const user = await getOrCreateUser(clerkId);
  const productIds = items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, direction: true },
  });
  const directionMap = new Map(products.map(p => [p.id, p.direction]));
  const originAddress = items
    .map(item => directionMap.get(item.productId))
    .filter(Boolean)
    .join(", ");
  const resolvedAddress = deliveryType === "pickup"
    ? (originAddress || address || "")
    : (address || "");
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      discount: 0,
      shipping: 0,
      address: resolvedAddress,
      originAddress: originAddress || "No address",
      receiverName: `${firstName} ${lastName}`,
      receiverPhone: phone,
      deliveryType,
      shippingAddress: resolvedAddress,
      status: "PENDING",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          sellerId: item.sellerId,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
}

export async function getOrders({
  clerkId,
  orderId,
  status,
  page,
  limit,
}: GetOrdersParams) {
  const user = clerkId ? await getOrCreateUser(clerkId) : null;

  if (orderId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(user && { userId: user.id }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order ?? null;
  }

  const where = {
    ...(user && { userId: user.id }),
    ...(status && { status }),
  };

  const [totalItems, orders] = await Promise.all([
    prisma.order.count({
      where,
    }),
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    data: orders,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}
export async function getOrdersByStatus(status?: string, page: number = 1, limit: number = 6) {
  const where = status && status !== "ALL" ? { status: status as any } : undefined;

  const [totalItems, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    data: orders,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}
export async function getOrderStatusCounts() {
  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  return Object.fromEntries(
    statusCounts.map((item) => [
      item.status,
      item._count,
    ])
  ) as Record<string, number>;
}
export async function getOrderConfirmationData(clerkId: string, orderId: string) {
  const user = await getUserByClerkId(clerkId);

  if (!user) return { user: null, order: null };

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return {
    user,
    order,
  };
}
export async function getLastOrdersByUser(clerkId: string, limit = 5) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      },
    },
  });

  if (!user) return null;

  return {
    user,
    orders: user.orders,
  };
}

export async function updateOrderStatusService(
  orderId: string,
  status: OrderStatusType
) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  if (status === "PAID") {
    await clearCartByUserId(order.userId);
  }

  return order;
}

export async function updateOrderService(
  orderId: string,
  data: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    total: number;
    status: OrderStatusType;
    createdAt: Date;
    items: { quantity: number; price: number }[];
  }
) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      total: data.total,
      status: data.status,
      createdAt: data.createdAt,
    },
  });

  if (data.status === "PAID") {
    await clearCartByUserId(order.userId);
  }

  if (order) {
    await prisma.user.update({
      where: { id: order.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
  });

  await Promise.all(
    data.items.map((item, index) => {
      const dbItem = orderItems[index];

      if (!dbItem) return;

      return prisma.orderItem.update({
        where: { id: dbItem.id },
        data: {
          quantity: item.quantity,
          price: item.price,
        },
      });
    })
  );
}

export async function deleteOrderService(orderId: string) {
  return prisma.order.delete({
    where: { id: orderId },
  });
}

export async function deleteOrderItemService(itemId: string) {
  return prisma.orderItem.delete({
    where: { id: itemId },
  });
}

export async function getMoreOrders(
  clerkId: string,
  skip: number
) {
  const user = await getOrCreateUser(clerkId);
  return prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              seller: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: 5,
  });
}