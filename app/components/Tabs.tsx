"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Tabs() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const handlePedidosClick = (e: React.MouseEvent) => {
    if (!isSignedIn) {
      e.preventDefault();
      openSignIn({ forceRedirectUrl: "/pedidos" });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      router.push(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="border-b px-4 md:px-10 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 md:gap-6">
          {tabs.map((tab) => {
            const isActive = tab.category === currentCategory;

            return (
              <Link
                key={tab.name}
                href={tab.category ? `/?category=${tab.category}` : "/"}
                className={`pb-2 text-sm md:text-base font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>

        <div className="w-full lg:flex-1 lg:flex lg:justify-center">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:max-w-md px-4 py-2 rounded-full border border-muted bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="w-full lg:w-auto">
          <Link
            href="/pedidos"
            onClick={handlePedidosClick}
            className="flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors w-full lg:w-auto"
          >
            📦 Ver mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}