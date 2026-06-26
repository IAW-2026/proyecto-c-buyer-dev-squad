import { getOrders } from "@/lib/services/Orders.service";
//Apis externas pueden consumir las órdenes de clientes, filtrar por id o status
export async function GET(req: Request): Promise<Response> {
  try {
    const secret = req.headers.get("buyer-key");
    const BUYER_SECRET = process.env.BUYER_SECRET;

    if (!BUYER_SECRET || secret !== BUYER_SECRET) {
      return new Response("Clave inválida", {
        status: 403,
      });
    }

    const { searchParams } = new URL(req.url);

    const orderId =
      searchParams.get("id") ?? undefined;

    const statusParam =
      searchParams.get("status");

    const status = [
      "PENDING",
      "PAID",
      "SHIPPED",
      "DELIVERED",
    ].includes(statusParam ?? "")
      ? (statusParam as
          | "PENDING"
          | "PAID"
          | "SHIPPED"
          | "DELIVERED")
      : undefined;

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number(searchParams.get("limit")) || 5
      )
    );

    const result = await getOrders({
      orderId,
      status,
      page,
      limit,
    });

    if (orderId && result === null) {
      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error
    );

    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}