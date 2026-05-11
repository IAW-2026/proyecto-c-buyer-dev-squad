import CartList from "../components/CartList";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Get user from our database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/");
  }

  const cart = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  const cartWithProducts = cart.map((item: {
    id: string;
    quantity: number;
    size: number;
    color: string;
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
  }) => ({
    id: item.id,
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
  }));

let total = 0;
for (const item of cartWithProducts) {
  total += item.price * item.quantity;
}

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Carrito</h1>

      {cartWithProducts.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <CartList items={cartWithProducts} total={total} />
      )}
    </main>
  );
}