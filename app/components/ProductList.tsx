"use client";

import { useState, useTransition } from "react";
import { fetchProductsAction } from "@/lib/actions/Products.actions";
import type { Product } from "../types/product";
import ModernProductCard from "./ModernProductCard";

interface Props {
  products: Product[];
  totalPages: number;
  currentPage: number;
  searchParams: Record<string, string | undefined>;
}

export default function ProductList({
  products: initialProducts,
  totalPages,
  currentPage,
  searchParams,
}: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(currentPage);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    if (page >= totalPages) return;

    const nextPage = page + 1;

    startTransition(async () => {
      const res = await fetchProductsAction({
        ...searchParams,
        page: nextPage,
        limit: 8,
      });
      setProducts((prev) => {
        const merged = [...prev, ...res.data];

        return Array.from(
          new Map(merged.map((p) => [p.id, p])).values()
        );
      });

      setPage(nextPage);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ModernProductCard key={p.id} product={p} />
        ))}
      </div>

      {page < totalPages && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-[var(--color-border)] text-[var(--color-foreground)] font-semibold text-sm rounded-full overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Cargando...
              </>
            ) : (
              <>
                Ver más productos
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
