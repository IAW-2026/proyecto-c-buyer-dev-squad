import { syncProducts } from "@/lib/syncProducts";

export async function POST(req: Request) {
  const secret = req.headers.get("x-secret");
  if (secret !== process.env.SYNC_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await syncProducts();
  return Response.json({ ok: true });
}
//Para traer a los productos de la base de datos
//  y sincronizarlos con los productos obtenidos de la API externa.
//  El endpoint se asegura de que solo se pueda acceder a esta
//  funcionalidad si se proporciona un secreto válido 
// en los encabezados de la solicitud.