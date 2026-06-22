"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { fetchProductsAction } from "@/lib/actions/Products.actions";
import type { Product } from "../types/product";

interface Props {
  products: Product[];
  totalPages: number;
  currentPage: number;
  searchParams: Record<number, number>;
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
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="border p-4 rounded-xl block"
          >
            <img
              src={p.image}
              className="h-40 w-full object-cover rounded-xl mb-3"
            />
            <h2>{p.name}</h2>
            <p className="font-bold">${p.price}</p>
            <p className="text-xs text-muted mt-1">{p.direction}</p>
          </Link>
        ))}
      </div>

      {page < totalPages && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-2 border rounded-full"
          >
            {isPending ? "Cargando..." : "Ver más"}
          </button>
        </div>
      )}
    </div>
  );
}