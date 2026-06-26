import { getRemoteSellers } from "../apis/seller-api";
import { prisma } from "../prisma";

export async function getSellers() {
  return prisma.seller.findMany();
}

export async function getSellerById(id: string) {
  return prisma.seller.findUnique({ where: { id } });
}
export async function syncSellers() {
  const sellers = await getRemoteSellers();

  for (const seller of sellers) {
    await prisma.seller.upsert({
      where: {
        id: seller.id,
      },
      update: {
        name: seller.name,
        description: seller.description ?? "",
        avatarUrl: seller.avatarUrl ?? "",
      },
      create: {
        id: seller.id,
        clerkId:
          seller.clerkId ??
          `external-${seller.id}`,
        name: seller.name,
        email:
          seller.email ??
          `${seller.id}@external.com`,
        description:
          seller.description ?? "",
        avatarUrl:
          seller.avatarUrl ?? "",
      },
    });
  }

  return {
    success: true,
    syncedSellers: sellers.length,
  };
}