const ORDER_ID = process.argv[2];

if (!ORDER_ID) {
  throw new Error("Falta ORDER_ID");
}

async function updateOrderStatusPaid() {
  const res = await fetch(
    `http://localhost:3000/api/orders/${ORDER_ID}/status`,
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

  const data = await res.json();

  console.log(data);
}

updateOrderStatusPaid();