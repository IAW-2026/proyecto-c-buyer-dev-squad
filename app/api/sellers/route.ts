import { getSellers, getSellerById } from "@/lib/sellers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const seller = await getSellerById(id);
    if (!seller) {
      return Response.json(
        { error: "Seller not found" },
        { status: 404 }
      );
    }
    return Response.json(seller);
  }

  const sellers = await getSellers();
  return Response.json(sellers);
}
