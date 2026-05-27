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
    orderCount: number; // informativo, no se guarda en DB directamente
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
