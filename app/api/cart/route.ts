import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      const clerkUser = await currentUser();
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser?.firstName || "",
          lastName: clerkUser?.lastName || "",
        },
      });
    }

    const cart = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    return Response.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId, quantity, size, color } = body;

    if (!productId || quantity == null || size == null || !color) {
      return Response.json(
        { error: "Missing productId, quantity, size or color" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      const clerkUser = await currentUser();
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser?.firstName || "",
          lastName: clerkUser?.lastName || "",
        },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        productId,
        userId: user.id,
        size,
        color,
      },
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: { product: true },
      });

      return Response.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        productId,
        userId: user.id,
        quantity,
        size,
        color,
      },
      include: { product: true },
    });

    return Response.json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return Response.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Missing cart item id" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingItem) {
      return Response.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (existingItem.quantity > 1) {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity: existingItem.quantity - 1 },
      });
    } else {
      await prisma.cartItem.delete({
        where: { id },
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return Response.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}