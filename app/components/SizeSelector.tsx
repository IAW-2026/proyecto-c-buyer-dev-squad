"use client";

import { useState } from "react";

type Props = {
  sizes: number[];
};

export default function SizeSelector({ sizes }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Talle</h2>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelected(size)}
            className={`w-12 h-12 border rounded-lg font-medium transition-colors
              ${selected === size
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface text-muted hover:border-primary hover:bg-surface"
              }`}
          >
            {size}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-sm mt-2">Talle seleccionado: {selected}</p>
      )}
    </div>
  );
}