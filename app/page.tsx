import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";
import Tabs from "./components/Tabs";
import Filters from "./components/Filters";
import Link from "next/link";
import CartButton from "./components/CartButton";

const categoryTitles: Record<string, string> = {
  hombre: "Zapatillas para Hombres",
  mujer: "Zapatillas para Mujeres",
  nino: "Zapatillas para Niños/as",
  zapatillas: "Zapatillas",
};
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function getProducts(searchParams: {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const params = new URLSearchParams();

  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.brand) params.set("brand", searchParams.brand);
  if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
  if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);

  const url = new URL(`/api/products?${params.toString()}`, baseUrl).toString();

  const res = await fetch(url, {
    cache: "no-store",
  });

  return res.json();
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