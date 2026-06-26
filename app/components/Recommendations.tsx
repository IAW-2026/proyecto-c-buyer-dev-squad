import { auth } from "@clerk/nextjs/server";
import type { Product } from "../types/product";

import { getFallbackRecommendationsService, getRecommendationsForUser } from "@/lib/services/Recommendations.service";
import { getUserByClerkId } from "@/lib/services/User.service";
import ModernProductCard from "./ModernProductCard";

interface RecommendationsResponse {
  recommendations: Product[];
  reason: string;
  basedOnHistory: boolean;
}

export default async function Recommendations({
  limit = 6,
  productBasePath = "/products",
}: {
  limit?: number;
  productBasePath?: string;
}) {
  let data: RecommendationsResponse;

  const { userId: clerkId } = await auth();

  if (clerkId) {
    const user = await getUserByClerkId(clerkId);

    if (user) {
      data = await getRecommendationsForUser(
        clerkId,
        limit
      );
    } else {
      data = await getFallbackRecommendationsService(limit);
    }
  } else {
    data = await getFallbackRecommendationsService(limit);
  }

  if (!data.recommendations.length) return null;

  return (
    <section className="w-full py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 md:h-7 rounded-full bg-[var(--color-primary)]" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-foreground)] tracking-tight">
              Para vos
            </h2>
            {data.basedOnHistory && (
              <span className="px-3 py-1 rounded-full text-[10px] md:text-xs font-medium border border-[var(--color-border)] text-[var(--color-muted)]">
                Basado en tus compras
              </span>
            )}
          </div>
          {data.reason && (
            <p className="text-sm text-[var(--color-muted)] mt-2 ml-4">
              {data.reason}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.recommendations.map((product) => (
            <ModernProductCard
              key={product.id}
              product={product}
              basePath={productBasePath}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
