import { prisma } from "@/lib/prisma";
import { getProducts } from "@/lib/products";

export async function GET() {
  try {
    const cart = await prisma.cartItem.findMany();
    return Response.json(cart);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity } = body;
    const PRODUCTS = await getProducts();
    if (!productId || quantity == null) {
      return Response.json(
        { error: "Missing productId or quantity" },
        { status: 400 }
      );
    }
    const product = PRODUCTS.find((p) => p.id === productId);

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { productId },
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return Response.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        productId,
        quantity,
      },
    });

    return Response.json({
      ...cartItem,
      product, // 🔥 devolvemos info del mock
    });
  } catch (error) {
  console.error("ERROR REAL:", error);
  return Response.json(
    { error: "Failed to add to cart" },
    { status: 500 }
  );
}
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Missing cart item id" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}