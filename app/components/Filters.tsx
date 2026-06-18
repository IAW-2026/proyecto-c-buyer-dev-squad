"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useCallback, useEffect } from "react";
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
        router.push(`/home?${params.toString()}`);
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
      router.push(`/home?${params.toString()}`);
    });
  }, [router, searchParams, startTransition]);

  return (
    <div className="relative flex flex-col sm:flex-row gap-4">
      <select
        onChange={(e) => updateBrand(e.target.value)}
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
          onChange={(e) => updateFilterDebounced("minPrice", e.target.value)}
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
          onChange={(e) => updateFilterDebounced("maxPrice", e.target.value)}
          className="border border-muted bg-surface-alt text-foreground p-2 pl-6"
        />
      </div>
    </div>
  );
}