import "server-only";

const SELLER_API =
  "https://proyecto-c-seller-dev-squad.vercel.app";

export async function getRemoteProducts() {
  const response = await fetch(
    `${SELLER_API}/api/products`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Error obteniendo productos");
  }

  const data = await response.json();

  return data.data ?? data;
}

export async function getRemoteSellers() {
  const response = await fetch(
    `${SELLER_API}/api/sellers`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Error obteniendo vendedores");
  }

  return response.json();
}