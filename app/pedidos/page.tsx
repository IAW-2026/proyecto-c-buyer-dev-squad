import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import OrdersList from "../components/OrdersList";

export default async function PedidosPage() {
  const { userId } = await auth();

  if (!userId) redirect("/");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) redirect("/");

  const pedidos = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

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

      {pedidos.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-5xl mb-4">📦</p>

          <p className="text-lg font-medium">
            Todavía no tenés pedidos
          </p>

          <Link
            href="/"
            className="mt-4 inline-block text-primary underline"
          >
            Ir a comprar
          </Link>
        </div>
      ) : (
        <OrdersList initialOrders={pedidos} />
      )}
    </main>
  );
}