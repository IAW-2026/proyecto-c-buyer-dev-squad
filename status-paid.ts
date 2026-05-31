const ORDER_ID = process.argv[2];

if (!ORDER_ID) {
  throw new Error("Falta ORDER_ID");
}

async function updateOrderStatusPaid() {
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
      status: "PAID",
    }),
  }
);
}

updateOrderStatusPaid();