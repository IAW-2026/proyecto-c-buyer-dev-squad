import "dotenv/config";
const O_ID = process.argv[2];

if (!O_ID) {
  throw new Error("Falta O_ID");
}

async function updateOrderStatusShipped() {
  const APP_URL =
  process.env.APP_URL ?? "http://localhost:3000";

const res = await fetch(
  `${APP_URL}/api/orders/${O_ID}/status`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "buyer-key": "buyer-dev-squad",
    },
    body: JSON.stringify({
      status: "SHIPPED",
    }),
  }
);
}

updateOrderStatusShipped();