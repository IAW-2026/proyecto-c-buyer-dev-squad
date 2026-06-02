"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getOrCreateUser(clerkId: string) {
  const clerkUser = await currentUser();

  return prisma.user.upsert({
    where: {
      clerkId,
    },
    update: {
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser?.firstName ?? "",
      lastName: clerkUser?.lastName ?? "",
    },
    create: {
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
  await ensureNotAdmin(userId);
  await prisma.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" },
  });
  revalidatePath("/admin/users");
}
 
export async function deleteUser(userId: string) {
  await ensureNotAdmin(userId);
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
  await ensureNotAdmin(userId);
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
export async function getUsers(search?: string, page: number = 1, limit: number = 6) {
  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      }
    : undefined;

  const [totalItems, users] = await Promise.all([
    prisma.user.count({ where: where as any }),
    prisma.user.findMany({
      where: where as any,
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { email: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    data: users as any[],
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}
export async function getNavbarUser(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
    select: {
      role: true,
      status: true,
      firstName: true,
      lastName: true,
      phone: true,
      address: true,
      birthDate: true,
    },
  });
}

export async function checkUserActive(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { status: true },
  });

  if (user?.status === "SUSPENDED") {
    throw new Error("Usted ha sido suspendido");
  }

  return true;
}
export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
  });
}
export type UpdateUserProfileData = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  birthDate: string;
};

export async function updateUserProfileData(
  clerkId: string,
  data: UpdateUserProfileData
) {
  return prisma.user.update({
    where: { clerkId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      birthDate: data.birthDate
        ? new Date(data.birthDate)
        : null,
    },
  });
}
async function ensureNotAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }
}