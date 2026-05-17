import { getOrCreateUser } from "@/lib/services/User.service";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("No autenticado", { status: 401 });
  }

  const admin = await getOrCreateUser(userId);

  if (!admin || (admin.role !== "ADMIN" && admin.role !== "SHIPPING")) {
    return new Response("No autorizado", { status: 403 });
  }

  const body = await req.json();
  const { status } = body as {
    status: "PENDING" | "COMPLETED" | "CANCELLED";
  };

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });

  return Response.json(order);
}