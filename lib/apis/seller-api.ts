import "server-only";

const SELLER_API = process.env.SELLER_API;

if (!SELLER_API) {
  throw new Error("Falta NEXT_PUBLIC_SELLER_API en .env");
}

export async function getRemoteProducts() {
  const response = await fetch(`${SELLER_API}/api/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error obteniendo productos");
  }

  const data = await response.json();

  return data.data ?? data;
}

export async function getRemoteSellers() {
  const response = await fetch(`${SELLER_API}/api/seller`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error obteniendo vendedores");
  }

  return response.json();
}