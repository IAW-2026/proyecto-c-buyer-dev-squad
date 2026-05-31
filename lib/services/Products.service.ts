import { prisma } from "../prisma";
import { getSellerById } from "./Sellers.service";

type GetProductsParams = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  includeSeller?: boolean;
};

export async function getProducts({
  category,
  brand,
  minPrice,
  maxPrice,
  search,
  page = 1,
  limit = 10,
  includeSeller = false,
}: GetProductsParams) {
  const where: any = {};

  if (category) where.category = category;
  if (brand) where.brand = brand;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
    ];
  }

  const min = minPrice ? parseFloat(minPrice.toString()) : undefined;
  const max = maxPrice ? parseFloat(maxPrice.toString()) : undefined;
  if (min !== undefined || max !== undefined) {
    where.price = {
      ...(min && { gte: min }),
      ...(max && { lte: max }),
    };
  }

  const [totalItems, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      ...(includeSeller && { include: { seller: true } }),
    }),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function getBrands(category?: string) {
  const brands = await prisma.product.findMany({
  where: category ? { category } : undefined,
  select: { brand: true },
  distinct: ["brand"],
  orderBy: { brand: "asc" },
});
return brands.map((p) => p.brand);
}