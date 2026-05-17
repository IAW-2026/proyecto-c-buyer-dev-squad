import { Product } from "@/app/types/product";
import { getProducts } from "@/lib/products";
import { getSellerById } from "@/lib/sellers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const PRODUCTS = await getProducts();

  let filtered: Product[] = PRODUCTS;

  if (category) {
    filtered = filtered.filter(
      (p: Product) => p.category === category
    );
  }

  if (brand) {
    filtered = filtered.filter(
      (p: Product) => p.brand === brand
    );
  }

  if (minPrice) {
    filtered = filtered.filter(
      (p: Product) => p.price >= Number(minPrice)
    );
  }

  if (maxPrice) {
    filtered = filtered.filter(
      (p: Product) => p.price <= Number(maxPrice)
    );
  }

  if (search) {
    filtered = filtered.filter(
      (p: Product) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
    );
  }

  const totalItems = filtered.length;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedProducts = filtered.slice(start, end);

  const productsWithSellers = await Promise.all(
    paginatedProducts.map(async (product: Product) => {
      const seller = await getSellerById(product.sellerId);

      return {
        ...product,
        seller,
      };
    })
  );

  return Response.json({
    data: productsWithSellers,

    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  });
}