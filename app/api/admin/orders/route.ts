import { authenticateAdminApi } from "@/lib/admin-api-auth";
import { getOrders } from "@/lib/services/Orders.service";

export async function GET(req: Request): Promise<Response> {
  const authError = authenticateAdminApi(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);

    const orderId = searchParams.get("id") ?? undefined;

    const statusParam = searchParams.get("status");
    const status = ["PENDING", "PAID", "SHIPPED", "DELIVERED"].includes(statusParam ?? "")
      ? (statusParam as "PENDING" | "PAID" | "SHIPPED" | "DELIVERED")
      : undefined;

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));

    const result = await getOrders({ orderId, status, page, limit });

    if (orderId && result === null) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
