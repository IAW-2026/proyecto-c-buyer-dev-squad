import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";
import Tabs from "./components/Tabs";
import Filters from "./components/Filters";
import CartButton from "./components/CartButton";
import { prisma } from "@/lib/prisma";

const categoryTitles: Record<string, string> = {
  hombre: "Zapatillas para Hombres",
  mujer: "Zapatillas para Mujeres",
  nino: "Zapatillas para Niños/as",
  zapatillas: "Zapatillas",
};

async function getProducts(searchParams: {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  return prisma.product.findMany({
    where: {
      ...(searchParams.category && {
        category: searchParams.category,
      }),

      ...(searchParams.brand && {
        brand: searchParams.brand,
      }),

      ...((searchParams.minPrice || searchParams.maxPrice) && {
        price: {
          ...(searchParams.minPrice && {
            gte: Number(searchParams.minPrice),
          }),

          ...(searchParams.maxPrice && {
            lte: Number(searchParams.maxPrice),
          }),
        },
      }),
    },
  });
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

  const products = await getProducts(searchParams);

  return (
    <main className="p-10">
      <Navbar />
      <Tabs />
      <Filters />

      <h1 className="text-3xl font-bold mb-6">
        {searchParams.category
          ? categoryTitles[searchParams.category] ?? "Productos"
          : "Zapatillas"}
      </h1>

      <ProductList products={products} />

      <CartButton />
    </main>
  );
}