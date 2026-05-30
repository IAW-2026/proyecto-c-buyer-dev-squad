"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Loader from "./Loader";

interface FiltersProps {
    brands: string[];
}
export default function Filters({ brands }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="relative flex flex-col sm:flex-row gap-4">
      {isPending && (
        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center rounded">
          <Loader size="sm" />
        </div>
      )}
      <select
        onChange={(e) => updateFilter("brand", e.target.value)}
        className="bg-surface-alt text-foreground border border-muted p-2"
      >
        <option value="" className="bg-surface-alt text-foreground">
          Todas las marcas </option>
        {brands.map((brand) => (
          <option key={brand} value={brand} className="bg-surface-alt text-foreground">
            {brand.charAt(0).toUpperCase() + brand.slice(1)}
          </option>
        ))}
      </select>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted">
          $
        </span>
        <input
          type="number"
          min={0}
          placeholder="Precio mínimo"
          onChange={(e) => updateFilter("minPrice", e.target.value)}
          className="border border-muted bg-surface-alt text-foreground p-2 pl-6"
        />
      </div>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted">
          $
        </span>
        <input
          type="number"
          min={0}
          placeholder="Precio máximo"
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
          className="border border-muted bg-surface-alt text-foreground p-2 pl-6"
        />
      </div>
    </div>
  );
}