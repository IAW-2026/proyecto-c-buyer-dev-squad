import { NextResponse } from "next/server";
import { syncProducts } from "@/lib/services/Products.service";
import { syncSellers } from "@/lib/services/Sellers.service";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");

  if (
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  await syncProducts();
  await syncSellers();
  return NextResponse.json({
    success: true,
  });
}