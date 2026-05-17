
import { OrderStatus } from "@/app/generated/prisma/client";
import type { OrderItem } from "../../types/order";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";


export async function POST(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, total }: { items: OrderItem[]; total: number } = body;

    if (!items || !Array.isArray(items) || total == null) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      const clerkUser = await currentUser();
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser?.primaryEmailAddress?.emailAddress || "",
          firstName: clerkUser?.firstName || "",
          lastName: clerkUser?.lastName || "",
        },
      });
    }

    // Crear la orden con sus items
    const order = await prisma.order.create({
      data: {
        userId: user.id,
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
      include: {
        items: true,
      },
    });

    // Limpiar el carrito del usuario después de hacer la orden
    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return Response.json({ orderId: order.id, ok: true });
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);

    const orderId = searchParams.get("id");

    const statusParam = searchParams.get("status");

    const status = Object.values(OrderStatus).includes(
      statusParam as OrderStatus
    )
      ? (statusParam as OrderStatus)
      : undefined;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: user.id,
        },

        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return order
        ? Response.json(order)
        : Response.json(
            { error: "Order not found" },
            { status: 404 }
          );
    }

    const whereClause = {
      userId: user.id,

      ...(status && {
        status,
      }),
    };

    const totalItems = await prisma.order.count({
      where: whereClause,
    });

    const orders = await prisma.order.findMany({
      where: whereClause,

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
    });

    return Response.json({
      data: orders,

      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}