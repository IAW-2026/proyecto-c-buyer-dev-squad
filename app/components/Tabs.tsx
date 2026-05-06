"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Tabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const tabs = [
    { name: "Ver todo", category: null },
    { name: "Hombres", category: "hombre" },
    { name: "Niño/a", category: "nino" },
    { name: "Mujer", category: "mujer" },
  ];

  return (
    <div className="flex gap-6 border-b px-10 mt-4">
      {tabs.map((tab) => {
        const isActive = tab.category === currentCategory;
        return (
          <Link
            key={tab.name}
            href={tab.category ? `/?category=${tab.category}` : "/"}
            className={`pb-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}