import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { getSellerById } from "@/lib/services/Sellers.service";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const seller = await getSellerById(id);

    if (!seller) {
      return Response.json({ error: "Seller not found" }, { status: 404 });
    }

    return Response.json(seller);
  } catch (error) {
    console.error("Error fetching seller:", error);
    return Response.json({ error: "Failed to fetch seller" }, { status: 500 });
  }
}
