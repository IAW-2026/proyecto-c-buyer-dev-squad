import { prisma } from "@/lib/prisma";

const BUYER_SECRET = process.env.buyer_SECRET;
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params;
  const secret = req.headers.get("buyer-key");
  if (!BUYER_SECRET || secret !== BUYER_SECRET) {
    return new Response("Clave inválida", { status: 403 });
  }
  const body = await req.json();
  const { status } = body;

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return Response.json(order);
}