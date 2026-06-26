import Link from "next/link";
import ProductActions from "@/app/components/ProductActions";
import SellerInfo from "@/app/components/SellerInfo";
import { getSellerById } from "@/lib/services/Sellers.service";
import { getProductById } from "@/lib/services/Products.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <Link href="/" className="text-info underline mt-4 block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const seller = await getSellerById(product.sellerId);

  return (
    <main className="px-4 md:px-8 pb-4 max-w-6xl mx-auto">
      <Link href="/tienda" className="text-sm text-muted underline">
        ← Volver
      </Link>

      <div className="grid md:grid-cols-2 gap-4 mt-2">
        <div className="flex items-start md:items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[280px] object-cover rounded-xl"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold">
            {product.name}
          </h1>

          <p className="text-muted text-xs mt-1 capitalize">
            {product.brand} · {product.category}
          </p>

          <p className="text-lg md:text-xl font-bold mt-2">
            ${product.price}
          </p>

          <div className="mt-3 p-3 border border-muted rounded-xl bg-surface">
            <h2 className="font-semibold mb-1 text-xs">Descripción</h2>
            <p className="text-muted text-xs">
              {product.description}
            </p>
          </div>

          <div className="mt-2 p-3 border border-muted rounded-xl bg-surface">
            <h2 className="font-semibold mb-1 text-xs">Dirección</h2>
            <p className="text-muted text-xs">{product.direction}</p>
          </div>

          <div className="mt-2">
            <ProductActions
              sizes={product.sizes}
              colors={product.colors}
              productId={product.id}
            />
          </div>

          {seller && <SellerInfo seller={seller} productId={product.id} />}
        </div>
      </div>
    </main>
  );
}
