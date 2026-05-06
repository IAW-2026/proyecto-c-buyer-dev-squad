"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Filters() {
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
    <div className="flex gap-4 px-10 mt-4">

      <select
        onChange={(e) => updateFilter("brand", e.target.value)}
        className="border p-2"
      >
        <option value="">Todas las marcas</option>
        <option value="nike">Nike</option>
        <option value="adidas">Adidas</option>
      </select>

      <input
        type="number"
        placeholder="Precio mínimo"
        onChange={(e) => updateFilter("minPrice", e.target.value)}
        className="border p-2"
      />

      <input
        type="number"
        placeholder="Precio máximo"
        onChange={(e) => updateFilter("maxPrice", e.target.value)}
        className="border p-2"
      />
    </div>
  );
}