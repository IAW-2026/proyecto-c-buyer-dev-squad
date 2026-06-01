import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const ID = process.argv[2];

if (!ID) {
  throw new Error("Falta ID");
}

async function updateOrderStatusDelivered() {
  const APP_URL = process.env.APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${APP_URL}/api/orders/${ID}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "buyer-key": process.env.BUYER_SECRET ?? "",
    },
    body: JSON.stringify({ status: "DELIVERED" }),
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${text}`);
  }
}

updateOrderStatusDelivered();