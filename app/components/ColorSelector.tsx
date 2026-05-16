"use client";

type Props = {
  colors: string[];
  selected: string | null;
  onSelect: (color: string) => void;
};

export default function ColorSelector({ colors, selected, onSelect }: Props) {
  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Color</h2>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`h-10 px-4 rounded-lg border font-medium transition-colors ${
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
        <p className="text-sm text-muted mt-2">Color seleccionado: {selected}</p>
      )}
    </div>
  );
}
