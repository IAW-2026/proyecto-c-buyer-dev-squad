import type { Order, OrderItem } from "../../types/order";

type StoredOrder = Omit<Order, "createdAt"> & { createdAt: Date };

const orders: StoredOrder[] = [];

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { items, total }: { items: OrderItem[]; total: number } = body;

  if (!items || !Array.isArray(items) || total == null) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
  const orderId = Date.now().toString();
  orders.push({
    id: orderId,
    items,
    total,
    status: "pending",
    createdAt: new Date(),
  });

  return Response.json({ orderId, ok: true });
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  if (orderId) {
    const order = orders.find((o) => o.id === orderId);
    return order
      ? Response.json(order)
      : Response.json({ error: "Order not found" }, { status: 404 });
  }

  return Response.json(orders);
}