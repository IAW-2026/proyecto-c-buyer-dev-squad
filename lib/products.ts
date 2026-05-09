import { prisma } from "@/lib/prisma";

export async function getProducts() {
  return prisma.product.findMany();
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}