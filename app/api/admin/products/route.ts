import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { getProducts } from "@/lib/services/Products.service";

export async function GET(req: Request): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);

    const result = await getProducts({
      category: searchParams.get("category") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      search: searchParams.get("search") ?? undefined,
      page: Math.max(1, Number(searchParams.get("page")) || 1),
      limit: Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10)),
      includeSeller: searchParams.get("includeSeller") === "true",
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
