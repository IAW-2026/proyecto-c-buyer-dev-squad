import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { prisma } from "@/lib/prisma";
import {
  updateOrderService,
  deleteOrderService,
} from "@/lib/services/Orders.service";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const status = ["PENDING", "PAID", "SHIPPED", "DELIVERED"].includes(body.status)
      ? body.status
      : existing.status;

    await updateOrderService(id, {
      firstName: body.firstName ?? null,
      lastName: body.lastName ?? null,
      email: body.email ?? "",
      total: body.total ?? existing.total,
      status,
      createdAt: body.createdAt ? new Date(body.createdAt) : existing.createdAt,
      items: body.items ?? [],
    });

    const updated = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: { include: { product: true } },
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating order:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    await deleteOrderService(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return Response.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
