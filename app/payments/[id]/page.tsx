import PaymentsButton from "@/app/components/PaymentsButton";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-surface-alt border border-muted rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">
          Proceder al pago
        </h1>

        <p className="text-muted mb-6">
          Simulación del proceso de pago para la orden #
          {id}
        </p>

        <PaymentsButton orderId={id} />
      </div>
    </main>
  );
}
