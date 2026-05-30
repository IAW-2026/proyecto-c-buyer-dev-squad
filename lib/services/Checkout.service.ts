import { prisma } from "@/lib/prisma";
import { createOrder } from "./Orders.service";
import { OrderItem } from "@/app/types/order";
import { getCartItems } from "./Cart.service";

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  deliveryType: "pickup" | "delivery";
  address?: string;
};

export async function processCheckout(
  userId: string,
  cartItems: OrderItem[],
  form: CheckoutFormData
) {
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      birthDate: form.birthDate
        ? new Date(form.birthDate)
        : null,
      address:
        form.deliveryType === "delivery"
          ? form.address ?? null
          : null,
    },
  });

  const order = await createOrder(
    userId,
    cartItems,
    total,
    form.firstName,
    form.lastName,
    form.phone,
    form.deliveryType,
    form.address
  );

  return order;
}

export async function getUserCheckoutData(
  userId: string
) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      phone: true,
      birthDate: true,
      address: true,
    },
  });
}
export async function getCheckoutPageData(clerkId: string) {
  const cartItems = await getCartItems(clerkId);

  if (!cartItems.length) {
    return null;
  }

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

  if (!user) return null;

  return {
    user,
    cartItems,
  };
}

export function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}