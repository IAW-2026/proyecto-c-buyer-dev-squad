import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * GET /api/recommendations
 *
 * Devuelve productos recomendados para el buyer autenticado
 * basándose en su historial de órdenes usando OpenAI.
 *
 * Query params:
 *   limit — cantidad de recomendaciones a devolver (default: 6, máx: 20)
 */
export async function GET(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "6", 10)));

    //Historial de órdenes del comprador
    const orders = await prisma.order.findMany({
      where: { userId: user.id, status: "COMPLETED" },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10, // últimas 10 órdenes como contexto
    });

    //Productos ya comprados para excluirlos
    const purchasedProductIds = new Set(
      orders.flatMap((o) => o.items.map((i) => i.productId))
    );

    //Si no tiene historial devuelve productos populares
    if (orders.length === 0) {
      const popular = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return Response.json({
        recommendations: popular,
        reason: "Productos destacados para vos",
        basedOnHistory: false,
      });
    }

    //Construir resumen del historial para el prompt
    const historyItems = orders.flatMap((o) =>
      o.items.map((item) => ({
        name: item.name,
        category: item.product?.category ?? "desconocida",
        brand: item.product?.brand ?? "desconocida",
        color: item.color ?? "N/A",
        price: item.price,
      }))
    );

    // Categorías y marcas más frecuentes
    const categoryCounts = historyItems.reduce<Record<string, number>>((acc, i) => {
      acc[i.category] = (acc[i.category] ?? 0) + 1;
      return acc;
    }, {});
    const brandCounts = historyItems.reduce<Record<string, number>>((acc, i) => {
      acc[i.brand] = (acc[i.brand] ?? 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([brand]) => brand);

    const avgPrice =
      historyItems.reduce((sum, i) => sum + i.price, 0) / historyItems.length;

    //Catálogo disponible que excluye ya comprados
    const catalog = await prisma.product.findMany({
      where: {
        id: { notIn: Array.from(purchasedProductIds) },
      },
      select: {
        id: true,
        name: true,
        category: true,
        brand: true,
        price: true,
        description: true,
        colors: true,
      },
    });

    if (catalog.length === 0) {
      return Response.json({
        recommendations: [],
        reason: "No hay productos nuevos disponibles",
        basedOnHistory: true,
      });
    }

    // Llamada a OpenAI
    const catalogSummary = catalog
      .map(
        (p) =>
          `ID:${p.id} | ${p.name} | cat:${p.category} | brand:${p.brand} | $${p.price.toFixed(2)} | colores:${p.colors.join(",")}`
      )
      .join("\n");

    const prompt = `
Sos un motor de recomendaciones de moda para una tienda online.

PERFIL DEL COMPRADOR:
- Categorías más compradas: ${topCategories.join(", ")}
- Marcas favoritas: ${topBrands.join(", ")}
- Precio promedio de compra: $${avgPrice.toFixed(2)}
- Últimas compras: ${historyItems
      .slice(0, 5)
      .map((i) => `${i.name} (${i.category})`)
      .join(", ")}

CATÁLOGO DISPONIBLE (productos que aún no compró):
${catalogSummary}

TAREA:
Seleccioná exactamente ${limit} IDs de productos del catálogo que mejor se adapten al perfil del comprador.
Priorizá: categorías similares, rango de precio parecido, marcas conocidas por el usuario.
Respondé ÚNICAMENTE con un JSON en este formato, sin texto extra:
{
  "ids": ["id1", "id2", ...],
  "reason": "frase corta explicando por qué estos productos (máx 15 palabras)"
}
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    let parsed: { ids: string[]; reason: string };
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      // Fallback: devolver productos de las mismas categorías top
      const fallback = await prisma.product.findMany({
        where: {
          id: { notIn: Array.from(purchasedProductIds) },
          category: { in: topCategories },
        },
        take: limit,
      });
      return Response.json({
        recommendations: fallback,
        reason: "Basado en tus categorías favoritas",
        basedOnHistory: true,
      });
    }

    //Buscar los productos recomendados en la DB
    const recommended = await prisma.product.findMany({
      where: { id: { in: parsed.ids } },
    });

    // Preservar el orden que sugirió OpenAI
    const ordered = parsed.ids
      .map((id) => recommended.find((p) => p.id === id))
      .filter(Boolean);

    return Response.json({
      recommendations: ordered,
      reason: parsed.reason,
      basedOnHistory: true,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return Response.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}