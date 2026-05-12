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
    }, 300); // delay para que no actualice en cada tecla

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="flex items-center border-b px-4 md:px-10 mt-4">
      <div className="flex gap-4 md:gap-6">
        {tabs.map((tab) => {
          const isActive = tab.category === currentCategory;

          return (
            <Link
              key={tab.name}
              href={tab.category ? `/?category=${tab.category}` : "/"}
              className={`pb-2 text-lg font-medium transition-colors ${
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
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-3 py-1.5 rounded-full border border-muted bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="ml-auto">
        <Link
          href="/pedidos"
          onClick={handlePedidosClick}
          className="whitespace-nowrap px-4 py-1.5 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
        >
          📦 Ver mis pedidos
        </Link>
      </div>
    </div>
  );
}