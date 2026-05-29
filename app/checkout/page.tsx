import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/services/Cart.service";
import { redirect } from "next/navigation";
import CheckoutForm from "../components/CheckoutForm";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const cartItems = await getCartItems(userId);

  if (!cartItems?.length) {
    redirect("/cart");
  }

  return (
    <CheckoutForm
      userId={userId}
      cartItems={cartItems}
    />
  );
}