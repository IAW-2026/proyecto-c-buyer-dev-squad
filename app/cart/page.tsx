import CartList from "../components/CartList";
import { prisma } from "@/lib/prisma";
import { getCartItems } from "@/lib/services/Cart.service";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/");
  }

const cartItems = await getCartItems(userId);
console.log("cartItems geeet:", cartItems); 
let total = 0;
for (const item of cartItems) {
  total += item.price * item.quantity;
}

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Carrito</h1>

      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <CartList items={cartItems} total={total} />
      )}
    </main>
  );
}