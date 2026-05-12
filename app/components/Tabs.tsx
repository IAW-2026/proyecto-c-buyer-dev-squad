"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

export default function Tabs() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

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
          openSignIn({
      forceRedirectUrl: "/pedidos",
    });
    }
  };

  return (
    <div className="flex gap-4 md:gap-6 border-b px-4 md:px-10 mt-4 overflow-x-auto">
      
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

      <div className="flex-1" />

      <Link
        href="/pedidos"
        onClick={handlePedidosClick}
        className="mb-2 whitespace-nowrap px-4 py-1.5 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
      >
        📦 Ver mis pedidos
      </Link>

    </div>
  );
}