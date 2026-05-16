"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: "PENDING" | "COMPLETED" | "CANCELLED") {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const admin = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!admin || admin.role !== "ADMIN") throw new Error("No autorizado");

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