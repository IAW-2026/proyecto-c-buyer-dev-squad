import Image from "next/image";
import Link from "next/link";
import type { Product } from "../types/product";

interface Props {
  product: Product;
  basePath?: string;
}

export default function ModernProductCard({ product, basePath = "/products" }: Props) {
  return (
    <Link
      href={`${basePath}/${product.id}`}
      className="group flex flex-col bg-[var(--color-surface-alt)] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.06)] hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[var(--color-primary)] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="px-6 py-3 rounded-full bg-[var(--color-background)]/90 backdrop-blur-sm text-[var(--color-foreground)] text-sm font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            Ver producto
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-4 md:p-5">
        <span className="text-[10px] md:text-xs font-medium text-[var(--color-muted)] uppercase tracking-[0.15em]">
          {product.brand}
        </span>

        <h3 className="text-sm md:text-base font-semibold text-[var(--color-foreground)] leading-tight line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors duration-300">
          {product.name}
        </h3>

        {product.colors.length > 0 && (
          <div className="flex gap-1 mt-0.5">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color}
                className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full border border-[var(--color-border)]"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-[var(--color-muted)] ml-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--color-border)]/50">
          <span className="text-base md:text-lg font-bold text-[var(--color-foreground)] tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[10px] md:text-xs text-[var(--color-muted)] truncate max-w-[120px] text-right">
            {product.direction}
          </span>
        </div>
      </div>
    </Link>
  );
}
