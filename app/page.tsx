import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";
import Tabs from "./components/Tabs";
import Filters from "./components/Filters";
import CartButton from "./components/CartButton";
import { prisma } from "@/lib/prisma";

const categoryTitles: Record<string, string> = {
  hombre: "Zapatillas/Hombres",
  mujer: "Zapatillas/Mujeres",
  nino: "Zapatillas/Niños/as",
  zapatillas: "Zapatillas",
};

async function getProducts(searchParams: {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string; 
}) {
  return prisma.product.findMany({
    where: {
      ...(searchParams.category && {
        category: searchParams.category,
      }),

      ...(searchParams.brand && {
        brand: searchParams.brand,
      }),

      ...(searchParams.search && {
        name: {
          contains: searchParams.search,
          mode: "insensitive", // no distingue mayúsculas
        },
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
async function getBrands(category?: string) {
  const products = await prisma.product.findMany({
    where: {
      ...(category && {
        category,
      }),
    },

    select: {
      brand: true,
    },
  });

  return [...new Set(products.map((p) => p.brand))]; // obtener marcas únicas
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
  const brandList = await getBrands(searchParams.category);
return (
  <main className="p-6 md:p-10 space-y-6">
    <Navbar />
    <Tabs />
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 className="text-2xl md:text-2xl font-bold">
        {searchParams.category
          ? categoryTitles[searchParams.category] ?? "Productos"
          : "Zapatillas"}
      </h1>

      <Filters brands={brandList} />
    </div>
    <section>
      <ProductList products={products} />
    </section>
    <CartButton />
  </main>
);
}