import { Suspense } from "react";
import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";
import Tabs from "./components/Tabs";
import CartButton from "./components/CartButton";
import Recommendations from "./components/Recommendations";
import ProductGridSkeleton from "./components/ProductGridSkeleton";
import { getBrands, getProducts} from "@/lib/services/Products.service";
import FiltersWrapper from "./components/FiltersWrapper";

const categoryTitles: Record<string, string> = {
  hombre: "Zapatillas/Hombres",
  mujer: "Zapatillas/Mujeres",
  nino: "Zapatillas/Niños/as",
  zapatillas: "Zapatillas",
};

function RecommendationsSkeleton() {
  return (
    <section className="w-full py-10">
      <div className="mb-6 flex flex-col gap-1">
        <div className="h-6 w-40 rounded-md bg-surface animate-pulse" />
        <div className="h-4 w-64 rounded-md bg-surface animate-pulse ml-6" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl overflow-hidden"
            style={{ backgroundColor: "var(--color-surface-alt)" }}
          >
            <div className="aspect-square w-full bg-surface animate-pulse" />
            <div className="flex flex-col gap-2 px-3 pb-3">
              <div className="h-3 w-12 rounded bg-surface animate-pulse" />
              <div className="h-4 w-full rounded bg-surface animate-pulse" />
              <div className="h-4 w-16 rounded bg-surface animate-pulse mt-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

async function ProductsSection({
  searchParams,
}: {
  searchParams: any;
}) {
  const products = await getProducts(searchParams);
  return <ProductList products={products.data} />;
}

export default async function Home(props: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className="p-6 md:p-10 space-y-6">
      <Navbar />
      <Tabs />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {searchParams.category
            ? categoryTitles[searchParams.category] ?? "Productos"
            : "Zapatillas"}
        </h1>

        <Suspense fallback={<div className="h-10 w-48 bg-surface animate-pulse rounded" />}>
          <FiltersWrapper category={searchParams.category} />
        </Suspense>
      </div>

      <section>
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<ProductGridSkeleton />}
        >
          <ProductsSection searchParams={searchParams} />
        </Suspense>
      </section>

      <CartButton />

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations limit={6} productBasePath="/products" />
      </Suspense>
    </main>
  );
}