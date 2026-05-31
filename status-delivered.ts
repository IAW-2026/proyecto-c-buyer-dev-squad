const ID = process.argv[2];

if (!ID) {
  throw new Error("Falta ID");
}

async function updateOrderStatusDelivered() {
  const APP_URL =
  process.env.APP_URL ?? "http://localhost:3000";

const res = await fetch(
  `${APP_URL}/api/orders/${ORDER_ID}/status`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "buyer-key": "buyer-dev-squad",
    },
    body: JSON.stringify({
      status: "DELIVERED",
    }),
  }
);
}

updateOrderStatusDelivered();