"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  return prisma.user.create({
    data: {
      clerkId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser?.firstName ?? "",
      lastName: clerkUser?.lastName ?? "",
    },
  });
}

export async function suspendUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { status: "SUSPENDED" },
  });
  revalidatePath("/admin/users");
}

export async function activateUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" },
  });
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export async function updateUser(
  userId: string,
  data: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    createdAt: Date;
    orderCount: number;
  }
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      createdAt: data.createdAt,
    },
  });
  revalidatePath("/admin/users");
}

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string; 
  deliveryType: "pickup" | "delivery";
  address?: string;
};

export async function submitCheckout(
  userId: string,
  cartItems: { productId: string; name: string; quantity: number; price: number; size: number; color: string }[],
  form: CheckoutFormData
): Promise<{ orderId: string }> {
  const total = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      birthDate: form.birthDate ? new Date(form.birthDate) : null,
      address: form.deliveryType === "delivery" ? (form.address ?? null) : undefined,
    },
  });

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: cartItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          size: i.size,
          color: i.color,
        })),
      },
    },
  });

  await prisma.cartItem.deleteMany({ where: { userId } });

  revalidatePath("/cart");
  revalidatePath("/orders");

  return { orderId: order.id };
}

export async function getUserCheckoutData(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      phone: true,
      birthDate: true,
      address: true,
    },
  });
}