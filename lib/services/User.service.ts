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
 