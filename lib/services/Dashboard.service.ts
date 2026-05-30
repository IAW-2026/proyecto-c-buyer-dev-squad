import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalUsers, totalOrders, totalProducts, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
    ]);

  const revenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
    where: {
      status: "PAID",
    },
  });

  const pendingOrders = await prisma.order.count({
    where: {
      status: "PENDING",
    },
  });

  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const topProducts = (
    await Promise.all(
      topProductsRaw.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: {
            id: item.productId,
          },
          select: {
            name: true,
            image: true,
            price: true,
          },
        });

        if (!product) return null;

        return {
          ...product,
          totalSold: item._sum.quantity ?? 0,
        };
      })
    )
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  const topSellersRaw = await prisma.order.groupBy({
    by: ["userId"],
    _count: {
      id: true,
    },
    _sum: {
      total: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  });

  const topSellers = (
    await Promise.all(
      topSellersRaw.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: {
            id: item.userId,
          },
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        });

        if (!user) return null;

        return {
          ...user,
          totalOrders: item._count.id,
          totalSpent: item._sum.total ?? 0,
        };
      })
    )
  ).filter((s): s is NonNullable<typeof s> => s !== null);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesByDay = await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: {
      total: true,
    },
    _count: {
      id: true,
    },
    where: {
      status: "PAID",
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const salesMap = new Map<
    string,
    {
      revenue: number;
      orders: number;
    }
  >();

  for (const entry of salesByDay) {
    const dateKey = entry.createdAt.toISOString().split("T")[0];

    const existing = salesMap.get(dateKey) ?? {
      revenue: 0,
      orders: 0,
    };

    salesMap.set(dateKey, {
      revenue: existing.revenue + (entry._sum.total ?? 0),
      orders: existing.orders + entry._count.id,
    });
  }

  const dailySales: {
    date: string;
    revenue: number;
    orders: number;
  }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();

    d.setDate(d.getDate() - i);

    const key = d.toISOString().split("T")[0];

    dailySales.push({
      date: key,
      revenue: salesMap.get(key)?.revenue ?? 0,
      orders: salesMap.get(key)?.orders ?? 0,
    });
  }

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    revenue: revenue._sum.total ?? 0,
    pendingOrders,
    recentOrders,
    topProducts,
    topSellers,
    dailySales,
  };
}