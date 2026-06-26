import { updateOrderStatusService } from "@/lib/services/Orders.service";
//Shipping y payments utilizarán este endpoint
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params;
  const secret = req.headers.get("buyer-key");
  const BUYER_SECRET = process.env.BUYER_SECRET;
  if (!BUYER_SECRET || secret !== BUYER_SECRET) {
    return new Response("Clave inválida", { status: 403 });
  }
  const body = await req.json();
  const { status } = body;

  const order = await updateOrderStatusService(id, status);

  return Response.json(order);
}
