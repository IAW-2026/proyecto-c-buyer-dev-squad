import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/services/User.service";
import { createOrder, getOrders } from "@/lib/services/Orders.service";
import type { OrderItem } from "@/app/types/order";

export async function POST(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      items,
      total,
      firstName,
      lastName,
      phone,
      deliveryType,
      address,

    }: {
      items: OrderItem[];
      total: number;
      firstName: string;
      lastName: string;
      phone: string;
      deliveryType: string;
      address?: string;
    } = await req.json();

    if (
      !items ||
      !Array.isArray(items) ||
      total == null
    ) {
      return Response.json(
        { error: "Invalid body" },
        { status: 400 }
      );
    }

    const user = await getOrCreateUser(userId);

    const order = await createOrder(
      user.id,
      items,
      total,
      firstName,
      lastName,
      phone,
      deliveryType,
      address
    );
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
    return Response.json({
      orderId: order.id,
      ok: true,
    });

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
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getOrCreateUser(userId);

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id") ?? undefined;
    const statusParam = searchParams.get("status");
    const status = ["PENDING", "PAID", "SHIPPED", "DELIVERED"].includes(statusParam ?? "")
      ? (statusParam as "PENDING" | "PAID" | "SHIPPED" | "DELIVERED")
      : undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const result = await getOrders({ userId: user.id, orderId, status, page, limit });

    if (orderId && result === null) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}