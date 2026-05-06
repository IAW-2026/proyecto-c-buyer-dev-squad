import CartList from "../components/CartList";
import { prisma } from "@/lib/prisma";
import { getProducts } from "@/lib/products";

export default async function CartPage() {
  const cart = await prisma.cartItem.findMany();
  const PRODUCTS = await getProducts();
  const cartWithProducts = cart.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);

    return {
      ...item,
      name: product?.name ?? "Producto",
      price: product?.price ?? 0,
      image: product?.image ?? "",
    };
  });

  const total = cartWithProducts.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Carrito</h1>

      {cartWithProducts.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <CartList items={cartWithProducts} total={total} />
      )}
    </main>
  );
}