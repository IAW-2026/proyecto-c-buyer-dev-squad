import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import CartList from "../components/CartList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCartSummary } from "@/lib/services/Cart.service";
import { getUserByClerkId } from "@/lib/services/User.service";
import BackButton from "../components/BackButton";
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
    <main className="max-w-2xl mx-auto px-4 py-4 text-foreground">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <BackButton />
        <span className="text-muted/40 select-none">|</span>
        <h1 className="text-lg font-bold">Carrito</h1>
      </div>

      {items.length === 0 ? (
        <section className="admin-section border border-muted rounded-2xl py-12 px-6 flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-surface mb-3">
            <ShoppingCart className="w-6 h-6 text-muted" />
          </div>
          <p className="font-semibold text-sm mb-1">Tu carrito está vacío</p>
          <p className="text-xs text-muted mb-5">
            Agregá productos para verlos aquí
          </p>
          <Link
            href="/"
            className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold transition-opacity"
          >
            Ir a la tienda
          </Link>
        </section>
      ) : (
        <section className="admin-section border border-muted rounded-2xl p-4">
          <CartList items={items} total={total} />
        </section>
      )}
    </main>
  );
}