"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { useLoading } from "./LoadingProvider";

export default function Tabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isPending, startTransition } = useLoading();

  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(currentSearch);

  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const tabs = [
    { name: "Ver todo", category: null },
    { name: "Hombres", category: "hombre" },
    { name: "Niño/a", category: "nino" },
    { name: "Mujer", category: "mujer" },
  ];

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tabCategory: string | null
  ) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams();
      if (tabCategory) {
        params.set("category", tabCategory);
      }
      const currentSearch = searchParams.get("search");
      if (currentSearch) params.set("search", currentSearch);
      const currentBrand = searchParams.get("brand");
      if (currentBrand) params.set("brand", currentBrand);
      const currentMin = searchParams.get("minPrice");
      if (currentMin) params.set("minPrice", currentMin);
      const currentMax = searchParams.get("maxPrice");
      if (currentMax) params.set("maxPrice", currentMax);
      router.push(`/tienda?${params.toString()}`);
    });
  };

  const handlePedidosClick = (e: React.MouseEvent) => {
    if (!isSignedIn) {
      e.preventDefault();
      openSignIn({ forceRedirectUrl: "/pedidos" });
    }
  };
  useEffect(() => {
    const currentSearchParam = searchParams.get("search") || "";
    const trimmed = search.trim();
    if (trimmed === currentSearchParam) return;

    const timeout = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (trimmed) {
          params.set("search", trimmed);
        } else {
          params.delete("search");
        }
        router.push(`/tienda?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, searchParams, startTransition, router]);

  return (
    <div className="border-b border-[var(--color-border)] px-4 md:px-10 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.category === currentCategory;

            return (
              <Link
                key={tab.name}
                href={tab.category ? `/tienda?category=${tab.category}` : "/tienda"}
                onClick={(e) => handleCategoryClick(e, tab.category)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>

        <div className="w-full lg:flex-1 lg:flex lg:justify-center">
          <div className="relative w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all pr-10"
            />
            {isPending && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader size="sm" />
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <Link
            href="/pedidos"
            onClick={handlePedidosClick}
            className="flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-foreground)] text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors w-full lg:w-auto"
          >
            Mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}