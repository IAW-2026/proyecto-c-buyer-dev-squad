import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getRecommendations(clerkId: string, limit: number) {
  const orders = await prisma.order.findMany({
    where: { userId: clerkId, status: "DELIVERED" },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const purchasedProductIds = new Set(
    orders.flatMap((o) => o.items.map((i) => i.productId))
  );

  if (orders.length === 0) {
    const popular = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return { recommendations: popular, reason: "Productos destacados para vos", basedOnHistory: false };
  }

  const historyItems = orders.flatMap((o) =>
    o.items.map((item) => ({
      name: item.name,
      category: item.product?.category ?? "desconocida",
      brand: item.product?.brand ?? "desconocida",
      color: item.color ?? "N/A",
      price: item.price,
    }))
  );

  const topCategories = getTopKeys(historyItems.map((i) => i.category), 3);
  const topBrands = getTopKeys(historyItems.map((i) => i.brand), 3);
  const avgPrice = historyItems.reduce((sum, i) => sum + i.price, 0) / historyItems.length;

  const catalog = await prisma.product.findMany({
    where: { id: { notIn: Array.from(purchasedProductIds) } },
    select: { id: true, name: true, category: true, brand: true, price: true, description: true, colors: true },
  });

  if (catalog.length === 0) {
    return { recommendations: [], reason: "No hay productos nuevos disponibles", basedOnHistory: true };
  }

  const catalogSummary = catalog
    .map((p) => `ID:${p.id} | ${p.name} | cat:${p.category} | brand:${p.brand} | $${p.price.toFixed(2)} | colores:${p.colors.join(",")}`)
    .join("\n");

  const prompt = `
Sos un motor de recomendaciones de moda para una tienda online.

PERFIL DEL COMPRADOR:
- Categorías más compradas: ${topCategories.join(", ")}
- Marcas favoritas: ${topBrands.join(", ")}
- Precio promedio de compra: $${avgPrice.toFixed(2)}
- Últimas compras: ${historyItems.slice(0, 5).map((i) => `${i.name} (${i.category})`).join(", ")}

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

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed: { ids: string[]; reason: string } = JSON.parse(raw.replace(/```json|```/g, "").trim());

    const recommended = await prisma.product.findMany({ where: { id: { in: parsed.ids } } });
    const ordered = parsed.ids.map((id) => recommended.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => p != null);

    return { recommendations: ordered, reason: parsed.reason, basedOnHistory: true };
  } catch {
    const fallback = await prisma.product.findMany({
      where: { id: { notIn: Array.from(purchasedProductIds) }, category: { in: topCategories } },
      take: limit,
    });
    return { recommendations: fallback, reason: "Basado en tus categorías favoritas", basedOnHistory: true };
  }
}


function getTopKeys(values: string[], top: number): string[] {
  const counts = values.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([key]) => key);
}

export interface RecommendationsResponse {
  recommendations: any[];
  reason: string;
  basedOnHistory: boolean;
}

export async function getRecommendationsForUser(
  clerkId: string,
  limit: number
): Promise<RecommendationsResponse> {
  return getRecommendations(clerkId, limit);
}

export async function getFallbackRecommendationsService(limit: number) {
  const popular = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return {
    recommendations: popular,
    reason: "Productos destacados para vos",
    basedOnHistory: false,
  };
}
