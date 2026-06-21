import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CheckoutForm from "../components/CheckoutForm";

import {
  getCheckoutPageData,
  formatDate,
} from "@/lib/services/Checkout.service";
import { getUserByClerkId } from "@/lib/services/User.service";

export default async function Page() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/login");
  }

  const dbCheck = await getUserByClerkId(clerkId);

  if (dbCheck?.status === "SUSPENDED") {
    redirect("/suspended");
  }

  const data = await getCheckoutPageData(clerkId);

  if (!data) {
    redirect("/cart");
  }

  const { user, cartItems } = data;

  const paymentsApiUrl = process.env.PAYMENTS_API_URL;

  return (
    <CheckoutForm
      id={user.id}
      cartItems={cartItems}
      initialData={{
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        birthDate: formatDate(user.birthDate),
        deliveryType: "pickup",
        address: user.address ?? "",
      }}
      paymentsApiUrl={paymentsApiUrl}
    />
  );
}