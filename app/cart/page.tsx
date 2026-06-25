import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
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
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-black rounded-lg">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Carrito
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-2xl py-16 px-6 shadow-sm">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              Tu carrito está vacío
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Agregá productos para verlos aquí
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
            <CartList items={items} total={total} />
          </div>
        )}
      </div>
    </main>
  );
}