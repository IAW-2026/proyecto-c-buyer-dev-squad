"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useCallback, useEffect } from "react";
import { Filter } from "lucide-react";
import { useLoading } from "./LoadingProvider";

interface FiltersProps {
    brands: string[];
}
export default function Filters({ brands }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startTransition } = useLoading();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const updateFilterDebounced = useCallback((key: string, value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`/tienda?${params.toString()}`);
      });
    }, 300);
  }, [router, searchParams, startTransition]);

  const updateBrand = useCallback((value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("brand", value);
      } else {
        params.delete("brand");
      }
      router.push(`/tienda?${params.toString()}`);
    });
  }, [router, searchParams, startTransition]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="relative w-full sm:w-auto">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
        <select
          onChange={(e) => updateBrand(e.target.value)}
          className="w-full sm:w-48 pl-9 pr-8 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all appearance-none cursor-pointer"
        >
          <option value="" className="bg-[var(--color-surface-alt)] text-[var(--color-foreground)]">
            Todas las marcas
          </option>
          {brands.map((brand) => (
            <option key={brand} value={brand} className="bg-[var(--color-surface-alt)] text-[var(--color-foreground)]">
              {brand.charAt(0).toUpperCase() + brand.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="relative flex-1 w-full sm:w-auto">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)] font-medium pointer-events-none">$</span>
        <input
          type="number"
          min={0}
          placeholder="Mín"
          onChange={(e) => updateFilterDebounced("minPrice", e.target.value)}
          className="w-full sm:w-32 px-4 py-2.5 pl-7 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <div className="relative flex-1 w-full sm:w-auto">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)] font-medium pointer-events-none">$</span>
        <input
          type="number"
          min={0}
          placeholder="Máx"
          onChange={(e) => updateFilterDebounced("maxPrice", e.target.value)}
          className="w-full sm:w-32 px-4 py-2.5 pl-7 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}