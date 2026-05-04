let cart: any[] = [];

export async function GET() {
  return Response.json(cart);
}

export async function POST(req: Request) {
  const body = await req.json();

  cart.push({
    id: Date.now().toString(),
    productId: body.productId,
    quantity: body.quantity,
  });

  return Response.json({ ok: true });
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  cart = cart.filter((item) => item.id !== id);

  return Response.json({ ok: true });
}