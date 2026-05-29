const O_ID = process.argv[2];

if (!O_ID) {
  throw new Error("Falta O_ID");
}

async function updateOrderStatusShipped() {
  const res = await fetch(
    `http://localhost:3000/api/orders/${O_ID}/status`,
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

  const data = await res.json();

  console.log(data);
}

updateOrderStatusShipped();