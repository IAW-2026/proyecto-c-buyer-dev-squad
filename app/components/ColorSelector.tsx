"use client";

type Props = {
  colors: string[];
  selected: string | null;
  onSelect: (color: string) => void;
};

export default function ColorSelector({ colors, selected, onSelect }: Props) {
  return (
    <div className="mt-2">
      <h2 className="font-semibold text-sm mb-1">Color</h2>
      <div className="flex flex-wrap gap-1.5">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`h-9 px-3 rounded-lg border font-medium text-sm transition-colors ${
              selected === color
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface text-muted hover:border-primary hover:bg-surface"
            }`}
          >
            {color}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-xs text-muted mt-1">Color seleccionado: {selected}</p>
      )}
    </div>
  );
}
