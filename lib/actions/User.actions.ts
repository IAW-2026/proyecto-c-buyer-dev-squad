"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  updateUserProfileData,
  checkUserActive,
  getUsers,
  getUserByClerkId,
  getNavbarUser,
  type UpdateUserProfileData,
} from "@/lib/services/User.service";

export async function updateUserProfile(
  formData: UpdateUserProfileData
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autenticado");
  }

  await checkUserActive(userId);

  await updateUserProfileData(userId, formData);

  revalidatePath("/");
}

export async function loadMoreAdminUsers(search: string | null, page: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  const admin = await getUserByClerkId(userId);
  if (!admin || admin.role !== "ADMIN") throw new Error("No autorizado");

  return getUsers(search ?? undefined, page, 6);
}

export async function getNavbarUserAction() {
  const { userId } = await auth();
  if (!userId) return null;
  return getNavbarUser(userId);
}