import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  let success = false;

  try {
    await prisma.order.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
    success = true;
  } catch (error) {
    console.error(error);
  }

  if (success) {
    redirect(`/checkout-confirmation/${id}`);
  } else {
    redirect(`/payments/${id}?error=true`);
  }
}