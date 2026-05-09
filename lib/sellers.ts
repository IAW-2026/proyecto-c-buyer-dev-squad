import { prisma } from "@/lib/prisma";

const SELLERS = [
  {
    id: "seller-1",
    clerkId: "clerk_seller_1",
    businessName: "Nike Official Store",
    email: "contact@nike.com",
    firstName: "Nike",
    lastName: "Store",
  },
  {
    id: "seller-2",
    clerkId: "clerk_seller_2",
    businessName: "Adidas Store",
    email: "contact@adidas.com",
    firstName: "Adidas",
    lastName: "Store",
  },
];
export async function syncSellers() {
  for (const s of SELLERS) {
    await prisma.seller.upsert({
      where: { id: s.id },
      update: {
        businessName: s.businessName,
        email: s.email,
        firstName: s.firstName,
        lastName: s.lastName,
      },
    create: {
      id: s.id,
      clerkId: s.clerkId,
      businessName: s.businessName,
      email: s.email,
      firstName: s.firstName,
      lastName: s.lastName,
    },
    });
  }
}

syncSellers().catch(console.error);

export async function getSellers() {
  return prisma.seller.findMany();
}

export async function getSellerById(id: string) {
  return prisma.seller.findUnique({ where: { id } });
}
