import Link from "next/link";
import { getBrands } from "@/lib/services/Products.service";

export default async function BrandsShowcase() {
  const brands = await getBrands();

  return (
    <section className="w-full py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="text-center mb-10">
          <p className="text-xs md:text-sm font-medium text-[var(--color-muted)] tracking-[0.2em] uppercase">
            Marcas populares
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {brands
          .filter((brand) => brand.toLowerCase() !== "otra")
          .map((brand) => (
            <Link
              key={brand}
              href={`/tienda?brand=${encodeURIComponent(brand)}`}
              className="group relative flex items-center justify-center h-20 md:h-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-background)] hover:shadow-lg hover:-translate-y-1"
            >
              <span className="text-lg md:text-xl font-bold text-[var(--color-muted)] group-hover:text-[var(--color-foreground)] transition-colors duration-300 tracking-tight">
                {brand}
              </span>

              <span className="absolute inset-0 bg-[var(--color-primary)] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}