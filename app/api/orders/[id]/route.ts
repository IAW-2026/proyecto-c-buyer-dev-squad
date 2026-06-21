import { getOrders } from "@/lib/services/Orders.service";

// Apis externas pueden consumir una orden puntual por id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
): Promise<Response> {
  try {
    const secret = req.headers.get("buyer-key");
    const BUYER_SECRET = process.env.BUYER_SECRET;

    if (!BUYER_SECRET || secret !== BUYER_SECRET) {
      return new Response("Clave inválida", {
        status: 403,
      });
    }

    const { id } = await params;

    const result = await getOrders({ orderId: id, page: 1, limit: 1 });

    if (result === null) {
      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching order:", error);

    return Response.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}