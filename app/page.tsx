import ProductList from "./components/ProductList";
import Link from "next/link";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Home() {
  const products = await getProducts();
  return (
    <main className="p-10">
      <Link href="/cart" className="underline">
      Ver carrito
    </Link>
      <h1 className="text-3xl font-bold mb-6">Zapatillas</h1>
      <ProductList products={products} />
    </main>
  );
}