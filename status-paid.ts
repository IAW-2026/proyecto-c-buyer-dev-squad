import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const ORDER_ID = process.argv[2];

if (!ORDER_ID) {
  throw new Error("Falta ORDER_ID");
}

async function updateOrderStatusPaid() {
  const APP_URL = process.env.APP_URL ?? "http://localhost:3000";
  console.log("APP_URL:", process.env.APP_URL);
console.log("BUYER_SECRET:", process.env.BUYER_SECRET);
  const res = await fetch(`${APP_URL}/api/orders/${ORDER_ID}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "buyer-key": process.env.BUYER_SECRET ?? "",
    },
    body: JSON.stringify({ status: "PAID" }),
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${text}`);
  }
}

updateOrderStatusPaid();