import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    
const { id } = await params;
const { userId } = await auth();

  if (!userId) redirect("/");

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-surface-alt border border-muted rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">
          Proceder al pago
        </h1>

        <p className="text-muted mb-6">
          Simulación del proceso de pago para la orden #{id}
        </p>

        <form action={`/api/payments/${id}`} method="POST">
          <button
            className="w-full btn-success py-3 rounded-lg font-bold"
          >
            Confirmar Pago
          </button>
        </form>
      </div>
    </main>
  );
}