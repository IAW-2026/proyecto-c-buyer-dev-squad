import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { getDashboardStats } from "@/lib/services/Dashboard.service";

export async function GET(req: Request): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const stats = await getDashboardStats();
    return Response.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return Response.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
