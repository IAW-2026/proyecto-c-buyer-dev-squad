import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import OrdersList from "../components/OrdersList";
import { getLastOrdersByUser } from "@/lib/services/Orders.service";

export default async function PedidosPage() {
  const { userId } = await auth();

  if (!userId) redirect("/");

  const result = await getLastOrdersByUser(userId, 5);

  if (!result) redirect("/");

  const { orders } = result;

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-sm text-muted underline">
          ← Volver
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Mis últimos 5 pedidos
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-5xl mb-4">📦</p>

          <p className="text-lg font-medium">
            Todavía no tenés pedidos
          </p>

          <Link href="/" className="mt-4 inline-block text-primary underline">
            Ir a comprar
          </Link>
        </div>
      ) : (
        <OrdersList initialOrders={orders} />
      )}
    </main>
  );
}