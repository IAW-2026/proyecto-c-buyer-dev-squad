let orders: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  const { items, total } = body;

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  if (orderId) {
    const order = orders.find((o) => o.id === orderId);
    return Response.json(order || null);
  }

  return Response.json(orders);
}
