"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  birthDate: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
    },
  });

  revalidatePath("/");
}