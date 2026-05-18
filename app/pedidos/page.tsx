import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  PENDING: "En proceso",
  COMPLETED: "Entregado",
  CANCELLED: "Cancelado",
};

const statusStyle: Record<string, string> = {
  PENDING: "bg-surface text-info",
  COMPLETED: "bg-surface text-success",
  CANCELLED: "bg-surface text-danger",
};

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
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="text-sm text-muted underline"
        >
          ← Volver
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Mis pedidos
        </h1>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-medium">Todavía no tenés pedidos</p>
          <Link href="/" className="mt-4 inline-block text-primary underline">
            Ir a comprar
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="border border-muted rounded-2xl p-4 sm:p-5 shadow-sm bg-surface-alt w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Pedido #{pedido.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(pedido.createdAt).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[pedido.status]}`}
                >
                  {statusLabel[pedido.status]}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {pedido.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                  >
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-surface flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">
                        {item.size && `Talle ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color}
                        {` · x${item.quantity}`}
                      </p>
                    </div>

                    <p className="text-sm font-semibold self-end sm:self-auto sm:text-right text-foreground">
                      ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>

                <div className="mt-4 pt-4 border-t border-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                
                <p className="font-bold text-base text-foreground">
                    Total: ${pedido.total.toLocaleString("es-AR")}
                </p>

                <Link
                    href={`/pedidos/${pedido.id}`}
                    className="btn-primary text-sm px-4 py-2 rounded-xl text-center"
                >
                    Ver estado del pedido
                </Link>

                </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}