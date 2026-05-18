import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/");

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 max-w-4xl mx-auto py-8">
      <div className="mb-4">
        <Link
          href="/pedidos"
          className="text-sm text-muted underline"
        >
          ← Volver
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-6">
        Estado del pedido
      </h1>

      <div className="bg-surface-alt border border-muted rounded-2xl p-6">
        <p className="text-muted">
          Acá se muestra el estado del pedido #{id}
        </p>
      </div>
    </main>
  );
}