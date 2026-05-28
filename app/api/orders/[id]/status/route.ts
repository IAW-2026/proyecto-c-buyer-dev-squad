import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("No autenticado", { status: 401 });
  }

  const { id } = await context.params;
/*
  const admin = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!admin || admin.role !== "ADMIN") {
    return new Response("No autorizado", { status: 403 });
  }*/ //temporalmente comentado para hacer pruebas

  const body = await req.json();
  const { status } = body;

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return Response.json(order);
}