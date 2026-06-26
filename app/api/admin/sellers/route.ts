import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { getSellers } from "@/lib/services/Sellers.service";

export async function GET(req: Request): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const sellers = await getSellers();
    return Response.json({ data: sellers });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return Response.json({ error: "Failed to fetch sellers" }, { status: 500 });
  }
}
