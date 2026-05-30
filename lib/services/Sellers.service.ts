import { prisma } from "../prisma";

export async function getSellers() {
  return prisma.seller.findMany();
}

export async function getSellerById(id: string) {
  return prisma.seller.findUnique({ where: { id } });
}
