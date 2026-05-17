import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getRecommendations } from "@/lib/services/Recommendations.service";

export async function GET(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const limit = Math.min(20, Math.max(1, parseInt(new URL(req.url).searchParams.get("limit") ?? "6", 10)));

    const result = await getRecommendations(user.id, limit);
    return Response.json(result);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return Response.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}