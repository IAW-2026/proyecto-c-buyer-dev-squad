import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";
import CartButton from "../components/CartButton";
import Recommendations from "../components/Recommendations";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import ProductList from "../components/ProductList";
import { getProducts } from "@/lib/services/Products.service";
import FiltersWrapper from "../components/FiltersWrapper";
import LoadingProvider from "../components/LoadingProvider";
import ProductsWrapper from "../components/ProductsWrapper";
import Footer from "../components/footer";
import RecommendationsSkeleton from "../components/RecommendationsSkeleton";

const categoryTitles: Record<string, string> = {
  hombre: "Zapatillas/Hombres",
  mujer: "Zapatillas/Mujeres",
  nino: "Zapatillas/Niños/as",
  zapatillas: "Zapatillas",
};

async function ProductsSection({ searchParams }: { searchParams: any }) {
  const page = parseInt(searchParams.page ?? "1");
  const products = await getProducts({ ...searchParams, page, limit: 8 });
  return (
    <ProductList
      products={products.data}
      totalPages={products.pagination.totalPages}
      currentPage={page}
      searchParams={searchParams}
    />
  );
}

export default async function Tienda(props: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <LoadingProvider>
      <main>
        <Navbar />

        <div className="bg-[var(--color-surface-alt)]/50">
          <div className="max-w-7xl mx-auto">
            <Tabs />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
              {searchParams.category
                ? categoryTitles[searchParams.category] ?? "Productos"
                : "Todos los productos"}
            </h1>

            <Suspense
              fallback={<div className="h-10 w-48 bg-[var(--color-surface)] animate-pulse rounded" />}
            >
              <FiltersWrapper category={searchParams.category} />
            </Suspense>
          </div>

          <section>
            <ProductsWrapper>
              <Suspense key={JSON.stringify(searchParams)} fallback={<ProductGridSkeleton />}>
                <ProductsSection searchParams={searchParams} />
              </Suspense>
            </ProductsWrapper>
          </section>
        </div>

        <Suspense fallback={<RecommendationsSkeleton />}>
          <Recommendations limit={6} productBasePath="/products" />
        </Suspense>

        <Footer />
        <CartButton />
      </main>
    </LoadingProvider>
  );
}