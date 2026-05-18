"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
/*PENDING → creado pero no pagado
PAID → pago aprobado
SHIPPED → enviado
DELIVERED → entregado al cliente */
export async function updateOrderStatus(orderId: string, status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED") {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const admin = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });
  // El rol "SHIPPING" puede actualizar a SHIPPED y DELIVERED, pero no a PENDING o PAID
  if (! admin || admin.role === "SHIPPING" && (status === "PENDING" || status === "PAID")) {
    throw new Error("No autorizado para este cambio de estado");
  }
  if (admin.role !== "ADMIN" && admin.role !== "SHIPPING") throw new Error("No autorizado");
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("No autenticado");

  const admin = await prisma.user.findUnique({
    where: { clerkId },
    select: { role: true },
  });

  if (!admin || admin.role !== "ADMIN") throw new Error("No autorizado");

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}