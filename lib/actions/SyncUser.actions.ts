"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

const SERVICES = [
  process.env.SELLER_API,
  process.env.NEXT_PUBLIC_SHIPPING_URL,
  process.env.PAYMENTS_API_URL,
  process.env.NEXT_PUBLIC_FEEDBACK_URL,
];

export async function syncUserToServices() {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const user = await currentUser();
  if (!user) throw new Error("Usuario no encontrado");

  const userData = {
    id: userId,
    nombre: user.firstName ?? "",
    apellido: user.lastName ?? "",
    email: user.emailAddresses[0]?.emailAddress ?? "",
    isAdmin: (user.publicMetadata?.role as string) === "ADMIN",
  };

  const BUYER_SECRET = process.env.BUYER_SECRET ?? "";

  const results = await Promise.allSettled(
    SERVICES.map(async (baseUrl) => {
      if (!baseUrl) return;
      const res = await fetch(`${baseUrl}/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "buyer-key": BUYER_SECRET,
        },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        console.warn(`Sync to ${baseUrl} failed: ${res.status}`);
      }
    })
  );

  const errors = results.filter((r) => r.status === "rejected");
  if (errors.length > 0) {
    console.error("Error syncing user to some services:", errors);
  }
}
