"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  updateUserProfileData,
  checkUserActive,
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