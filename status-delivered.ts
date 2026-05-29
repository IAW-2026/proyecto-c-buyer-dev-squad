const ID = process.argv[2];

if (!ID) {
  throw new Error("Falta ID");
}

async function updateOrderStatusDelivered() {
  const res = await fetch(
    `http://localhost:3000/api/orders/${ID}/status`,
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

  const data = await res.json();

  console.log(data);
}

updateOrderStatusDelivered();