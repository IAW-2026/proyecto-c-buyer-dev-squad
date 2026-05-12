import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PedidoDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Acá después vas a hacer una consulta a tu API para traer el detalle del pedido usando el id de params.id
  // const res = await fetch(`${process.env.API_URL}/orders/${params.id}`);
  // const pedido = await res.json();

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Estado del pedido
      </h1>

      <div className="bg-surface-alt border border-muted rounded-2xl p-6">
        <p className="text-muted">
          Acá se va a mostrar el estado del pedido #{params.id}
        </p>
      </div>
    </main>
  );
}