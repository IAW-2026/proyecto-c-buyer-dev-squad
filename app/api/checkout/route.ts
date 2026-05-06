
import type { OrderItem } from "../../types/order";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { items, total }: { items: OrderItem[]; total: number } = body;

    if (!items || !Array.isArray(items) || total == null) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }

    // Crear la orden con sus items
    const order = await prisma.order.create({
      data: {
        total,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Limpiar el carrito después de hacer checkout
    await prisma.cartItem.deleteMany({});

    return Response.json({ orderId: order.id, ok: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      return order
        ? Response.json(order)
        : Response.json({ error: "Order not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(orders);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}