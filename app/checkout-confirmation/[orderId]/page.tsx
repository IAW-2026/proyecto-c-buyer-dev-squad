import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CheckoutConfirmation({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { orderId } = await params;

  // Get user from our database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold mb-6 text-danger">
          Orden no encontrada
        </h1>
        <Link href="/" className="text-info hover:underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="p-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-success-light border border-success rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-success mb-2">
            ¡Compra Exitosa!
          </h1>
          <p className="text-muted">
            Tu orden ha sido procesada correctamente
          </p>
        </div>

        <div className="bg-surface border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Detalles de la Orden</h2>

          <div className="mb-4 pb-4 border-b">
            <p className="text-muted">
              <span className="font-semibold">ID de Orden:</span> {order.id}
            </p>
            <p className="text-muted">
              <span className="font-semibold">Estado:</span>{" "}
              <span className="bg-info-light text-info px-2 py-1 rounded">
                {order.status}
              </span>
            </p>
            <p className="text-muted">
              <span className="font-semibold">Fecha:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString("es-AR")}
            </p>
          </div>

          <h3 className="text-xl font-bold mb-4">Productos</h3>
          <div className="space-y-3 mb-6">
          {order.items.map((item: {
            id: string;
            name: string;
            price: number;
            quantity: number;
          }) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-3 bg-surface-alt rounded"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-muted">Cantidad: {item.quantity}</p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-success">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-info-light border border-info rounded-lg p-6 mb-8">
          <h3 className="font-bold mb-2">Próximos Pasos</h3>
          <ul className="space-y-2 text-muted">
            <li>✓ Recibirás un email de confirmación en breve</li>
            <li>✓ Tu pedido será enviado en 2-3 días hábiles</li>
            <li>✓ Recibirás un número de seguimiento</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 btn-info font-bold py-2 px-4 rounded-lg text-center transition"
          >
            Seguir Comprando
          </Link>
          <Link
            href="/cart"
            className="flex-1 btn-secondary font-bold py-2 px-4 rounded-lg text-center transition"
          >
            Ver Carrito
          </Link>
        </div>
      </div>
    </main>
  );
}