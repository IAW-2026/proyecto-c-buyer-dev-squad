import CartList from "../components/CartList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCartSummary } from "@/lib/services/Cart.service";

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { items, total } = await getCartSummary(userId);

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Carrito
      </h1>

      {items.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <CartList items={items} total={total} />
      )}
    </main>
  );
}