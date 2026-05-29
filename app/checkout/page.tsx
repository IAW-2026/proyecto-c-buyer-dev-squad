import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/services/Cart.service";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "../components/CheckoutForm";
import type { CheckoutFormData } from "@/lib/actions/Checkout.actions";

export default async function Page() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/login");

  const cartItems = await getCartItems(clerkId);
  if (!cartItems?.length) redirect("/cart");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      birthDate: true,
      address: true,
    },
  });

  if (!user) redirect("/cart");

  function formatDate(date: Date | null | undefined): string {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  }

  const initialData: CheckoutFormData = {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
    birthDate: formatDate(user.birthDate),
    deliveryType: "pickup",
    address: user.address ?? "",
  };

  return (
    <CheckoutForm
      userId={user.id}
      cartItems={cartItems}
      initialData={initialData}
    />
  );
}
