"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { OrderStatusType } from "@/app/types/order";
export async function updateOrderStatus(orderId: string, status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED") {
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
export async function updateOrder(
  orderId: string,
  data: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    total: number;
    status: OrderStatusType;
    createdAt: Date;
    items: { quantity: number; price: number }[];
  }
) {
  // Actualizar el pedido
  await prisma.order.update({
    where: { id: orderId },
    data: {
      total: data.total,
      status: data.status,
      createdAt: data.createdAt,
    },
  });
 
  // Actualizar el usuario asociado al pedido
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true },
  });
 
  if (order) {
    await prisma.user.update({
      where: { id: order.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });
  }
 
  // Actualizar los items (cantidad y precio) en orden
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
  });
 
  await Promise.all(
    data.items.map((item, i) => {
      const dbItem = orderItems[i];
      if (!dbItem) return;
      return prisma.orderItem.update({
        where: { id: dbItem.id },
        data: { quantity: item.quantity, price: item.price },
      });
    })
  );
 
  revalidatePath("/admin/orders");
}
 
export async function deleteOrder(orderId: string) {
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
}
export async function deleteOrderItem(itemId: string) {
  await prisma.orderItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/admin/orders");
}