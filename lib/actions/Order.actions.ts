"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  updateOrderStatusService,
  updateOrderService,
  deleteOrderService,
  deleteOrderItemService,
  getMoreOrders,
  getOrdersByStatus,
} from "@/lib/services/Orders.service";

import { OrderStatusType } from "@/app/types/order";
import { getUserByClerkId } from "../services/User.service";

async function requireAdmin() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("No autenticado");

  const clerkUser = await currentUser();
  const role = clerkUser?.publicMetadata?.role as string | undefined;
  if (role !== "admin") throw new Error("No autorizado");
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatusType
) {
  await requireAdmin();

  await updateOrderStatusService(orderId, status);

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
  await requireAdmin();

  await updateOrderService(orderId, data);

  revalidatePath("/admin/orders");
}

export async function deleteOrder(orderId: string) {
  await requireAdmin();

  await deleteOrderService(orderId);

  revalidatePath("/admin/orders");
}

export async function deleteOrderItem(itemId: string) {
  await requireAdmin();

  await deleteOrderItemService(itemId);

  revalidatePath("/admin/orders");
}

export async function loadMoreOrders(skip: number) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return [];
  }

  const user = await getUserByClerkId(clerkId);

  if (!user) {
    return [];
  }

  return getMoreOrders(user.id, skip);
}
export async function getFiveMoreOrders(
  skip: number
) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return [];
  }
  const user = await getUserByClerkId(clerkId);

  if (!user) {
    return [];
  }

  return getMoreOrders(user.id, skip);
}

export async function loadMoreAdminOrders(status: string | null, page: number) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("No autenticado");
  const clerkUser = await currentUser();
  const role = clerkUser?.publicMetadata?.role as string | undefined;
  if (role !== "admin") throw new Error("No autorizado");

  return getOrdersByStatus(status ?? undefined, page, 6);
}