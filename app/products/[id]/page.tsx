import AddToCartButton from "@/app/components/AddToCartButton";
import SizeSelector from "@/app/components/SizeSelector";
import { getProducts } from "@/lib/products";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: Props) {
    const { id } = await params; //con la nueva forma de recibir params se debe hacer de esta forma
    const PRODUCTS = await getProducts();
    const product = PRODUCTS.find((p) => p.id === id);
    console.log("Producto seleccionado:", product);
  if (!product) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>

        <Link href="/" className="text-blue-500 underline mt-4 block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-gray-500 underline">
        ← Volver
      </Link>

      <div className="mt-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-h-[400px] object-cover rounded-xl"
        />

        <h1 className="text-3xl font-bold mt-6">
          {product.name}
        </h1>

        <p className="text-gray-600 mt-2 capitalize">
          Marca: {product.brand}
        </p>

        <p className="text-gray-600 capitalize">
          Categoría: {product.category}
        </p>

        <p className="text-2xl font-bold mt-4">
          ${product.price}
        </p>

        <div className="mt-6 p-4 border rounded-xl">
          <h2 className="font-semibold mb-2">Descripción</h2>
          <p className="text-gray-700">
            {product.description}
          </p>
        </div>
        <SizeSelector sizes={product.sizes} />
        <div className="mt-6 flex gap-3">
          <AddToCartButton productId={product.id} />
          <button className="border px-5 py-2 rounded">
            Comprar ahora
          </button>
        </div>
      </div>
    </main>
  );
}