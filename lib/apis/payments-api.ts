
export async function postOrder(order: unknown) {
  const PAYMENTS_API_URL = process.env.PAYMENTS_API_URL;

  if (!PAYMENTS_API_URL) {
    throw new Error("PAYMENTS_API_URL is not configured");
  }
  const res = await fetch(
    `${PAYMENTS_API_URL}/api/payments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }
  );

  if (!res.ok) {
    throw new Error(`Payments API error: ${res.status}`);
  }

  return res.json();
}