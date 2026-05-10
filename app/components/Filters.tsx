"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface FiltersProps {
    brands: string[];
}
export default function Filters({ brands }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <select
        onChange={(e) => updateFilter("brand", e.target.value)}
        className="bg-black text-white border border-white p-2"
      >
        <option value="" className="bg-black text-white">
          Todas las marcas </option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand.charAt(0).toUpperCase() + brand.slice(1)}
          </option>
        ))}
      </select>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
          $
        </span>
        <input
          type="number"
          min={0}
          placeholder="Precio mínimo"
          onChange={(e) => updateFilter("minPrice", e.target.value)}
          className="border p-2 pl-6"
        />
      </div>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
          $
        </span>
        <input
          type="number"
          min={0}
          placeholder="Precio máximo"
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
          className="border p-2 pl-6"
        />
      </div>
    </div>
  );
}