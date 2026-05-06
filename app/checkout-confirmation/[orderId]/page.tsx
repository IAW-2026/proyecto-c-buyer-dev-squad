import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CheckoutConfirmation({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold mb-6 text-red-600">
          Orden no encontrada
        </h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="p-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            ¡Compra Exitosa!
          </h1>
          <p className="text-gray-700">
            Tu orden ha sido procesada correctamente
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Detalles de la Orden</h2>

          <div className="mb-4 pb-4 border-b">
            <p className="text-gray-600">
              <span className="font-semibold">ID de Orden:</span> {order.id}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Estado:</span>{" "}
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {order.status}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Fecha:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString("es-AR")}
            </p>
          </div>

          <h3 className="text-xl font-bold mb-4">Productos</h3>
          <div className="space-y-3 mb-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">Cantidad: {item.quantity}</p>
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
              <span className="text-green-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold mb-2">Próximos Pasos</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Recibirás un email de confirmación en breve</li>
            <li>✓ Tu pedido será enviado en 2-3 días hábiles</li>
            <li>✓ Recibirás un número de seguimiento</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
          >
            Seguir Comprando
          </Link>
          <Link
            href="/cart"
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
          >
            Ver Carrito
          </Link>
        </div>
      </div>
    </main>
  );
}