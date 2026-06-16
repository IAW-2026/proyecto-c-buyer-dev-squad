import CartList from "../components/CartList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCartSummary } from "@/lib/services/Cart.service";
import { getUserByClerkId } from "@/lib/services/User.service";

export default async function CartPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/");
  }

  const user = await getUserByClerkId(clerkId);

  if (user?.status === "SUSPENDED") {
    redirect("/suspended");
  }

  const { items, total } = await getCartSummary(clerkId);

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