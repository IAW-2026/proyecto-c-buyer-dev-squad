import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { getProductById } from "@/lib/services/Products.service";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const product = await getProductById(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
