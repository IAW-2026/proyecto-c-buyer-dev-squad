import Link from "next/link";
import type { Product } from "../types/product";

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <Link key={p.id} href={`/products/${p.id}`} className="border p-4 rounded-xl block">
          <div className="mb-4 h-40 md:h-48 overflow-hidden rounded-xl bg-surface-alt">
            <img
              src={p.image}
              alt={p.name}
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-lg md:text-xl font-semibold">{p.name}</h2>
          <p className="mt-2 text-base md:text-lg font-bold">${p.price}</p>
        </Link>
      ))}
    </div>
  );
}
