import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Buscar la orden con sus items por su id
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return Response.json(
        {
          ok: false,
          error: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    // Payload que después se envía a la API de payments
    const paymentPayload = {
      orderId: order.id,

      total: order.total,

      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      })),
    };

    console.log("PAYMENT PAYLOAD");
    console.log(paymentPayload);

    /*
    Se le envía el payload a la API de pagos, que en este caso es simulada, 
    pero en un caso real sería algo como Stripe, MercadoPago, etc.
      const paymentResponse = await fetch(
        "https://payments-api.com/create-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const paymentData = await paymentResponse.json();
    */

    // Simulación de pago exitoso
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: "PAID",
      },
    });

    return Response.json({
      ok: true,

      redirectTo: `/order-confirmation/${id}`,

      paymentPayload,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        ok: false,
      },
      {
        status: 500,
      }
    );
  }
}