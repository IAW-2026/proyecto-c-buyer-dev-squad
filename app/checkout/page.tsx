import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CheckoutForm from "../components/CheckoutForm";

import {
  getCheckoutPageData,
  formatDate,
} from "@/lib/services/Checkout.service";

export default async function Page() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/login");
  }

  const data = await getCheckoutPageData(clerkId);

  if (!data) {
    redirect("/cart");
  }

  const { user, cartItems } = data;

  return (
    <CheckoutForm
      userId={user.id}
      cartItems={cartItems}
      initialData={{
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        birthDate: formatDate(user.birthDate),
        deliveryType: "pickup",
        address: user.address ?? "",
      }}
    />
  );
}