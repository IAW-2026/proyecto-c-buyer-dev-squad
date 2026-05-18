"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../types/product";

interface RecommendationsResponse {
  recommendations: Product[];
  reason: string;
  basedOnHistory: boolean;
}

interface RecommendationsProps {
  limit?: number;
  productBasePath?: string;
}

export default function Recommendations({
  limit = 6,
  productBasePath = "/products",
}: RecommendationsProps) {
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch(`/api/recommendations?limit=${limit}`);
        if (!res.ok) throw new Error("Error al cargar recomendaciones");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [limit]);

  if (loading) return <RecommendationsSkeleton count={limit} />;

  if (error || !data || data.recommendations.length === 0) return null;

  return (
    <section className="w-full py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">✦</span>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Para vos
          </h2>
          {data.basedOnHistory && (
            <span
              className="ml-2 rounded-full px-2 py-0.5 text-xs font-medium border border-muted text-muted"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              Basado en tus compras
            </span>
          )}
        </div>
        {data.reason && (
          <p className="text-sm text-muted pl-6">{data.reason}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {data.recommendations.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            basePath={productBasePath}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  basePath,
}: {
  product: Product;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/${product.id}`}
      className="group flex flex-col gap-2 rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
      style={{ backgroundColor: "var(--color-surface-alt)" }}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1 px-3 pb-3">
        <span className="text-xs text-muted uppercase tracking-wide">
          {product.brand}
        </span>
        <span className="text-sm font-medium text-foreground line-clamp-1 leading-tight">
          {product.name}
        </span>

        {product.colors.length > 0 && (
          <div className="flex gap-1 mt-0.5 flex-wrap">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="h-3 w-3 rounded-full border border-muted"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        <span className="mt-1 text-sm font-semibold text-primary">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}

function RecommendationsSkeleton({ count }: { count: number }) {
  return (
    <section className="w-full py-10">
      <div className="mb-6 flex flex-col gap-1">
        <div className="h-6 w-40 rounded-md bg-surface animate-pulse" />
        <div className="h-4 w-64 rounded-md bg-surface animate-pulse ml-6" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl overflow-hidden"
            style={{ backgroundColor: "var(--color-surface-alt)" }}
          >
            <div className="aspect-square w-full bg-surface animate-pulse" />
            <div className="flex flex-col gap-2 px-3 pb-3">
              <div className="h-3 w-12 rounded bg-surface animate-pulse" />
              <div className="h-4 w-full rounded bg-surface animate-pulse" />
              <div className="h-4 w-16 rounded bg-surface animate-pulse mt-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}