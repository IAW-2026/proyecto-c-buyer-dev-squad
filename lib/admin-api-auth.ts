export function authenticateAdminApi(req: Request): Response | null {
  const secret = req.headers.get("buyer-key");
  const BUYER_SECRET = process.env.BUYER_SECRET;

  if (!BUYER_SECRET || secret !== BUYER_SECRET) {
    return new Response("Clave inválida", { status: 403 });
  }

  return null;
}
