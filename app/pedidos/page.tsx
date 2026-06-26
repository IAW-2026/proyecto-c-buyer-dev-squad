import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import OrdersList from "../components/OrdersList";
import { getLastOrdersByUser } from "@/lib/services/Orders.service";

export default async function PedidosPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/");

  const result = await getLastOrdersByUser(clerkId, 5);

  if (!result) redirect("/");
  if (result.user.status === "SUSPENDED") redirect("/suspended");

  const { orders } = result;

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/tienda" className="text-sm text-muted underline">
          ← Volver
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Mis pedidos
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
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