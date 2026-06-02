import { prisma } from "@/lib/prisma";
import { OrderItem, OrderStatusType } from "@/app/types/order";
import { getUserByClerkId } from "./User.service";

type GetOrdersParams = {
  userId?: string;
  orderId?: string;
  status?: OrderStatusType;
  page: number;
  limit: number;
};

export async function createOrder(
  userId: string,
  items: OrderItem[],
  total: number,
  firstName: string,
  lastName: string,
  phone: string,
  deliveryType: string,
  address?: string
) {
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      receiverName: `${firstName} ${lastName}`,
      receiverPhone: phone,
      deliveryType,
      shippingAddress: address,
      status: "PENDING",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
      },
    },

    include: {
      items: true,
    },
  });
     /*Cuando se crea la orden, se hará una llamada a un servicio externo de payments
    para iniciar el proceso de pago y este lo envía a shipping y seller. Por ejemplo:
   await fetch("https://payments.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYMENTS_API_KEY}`,
      },
      body: JSON.stringify({
        orderId: order.id,
        total,
        firstName,
        lastName,
        phone,
        deliveryType,
        address,
        items,
      }),
    });
  */
  return order; 
}

export async function getOrders({
  userId,
  orderId,
  status,
  page,
  limit,
}: GetOrdersParams) {
  if (orderId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(userId && { userId }),
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
    ...(userId && { userId }),
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
export async function getOrderConfirmationData(userId: string, orderId: string) {
  const user = await getUserByClerkId(userId);

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
              product: true,
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
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
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
  await prisma.order.update({
    where: { id: orderId },
    data: {
      total: data.total,
      status: data.status,
      createdAt: data.createdAt,
    },
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true },
  });

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
  userId: string,
  skip: number
) {
  return prisma.order.findMany({
    where: {
      userId,
    },
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
    skip,
    take: 5,
  });
}