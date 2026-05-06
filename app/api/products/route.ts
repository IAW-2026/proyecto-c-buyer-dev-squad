import { getProducts } from "@/lib/products";
//si se le pasa un filtro, devuelve solo los productos de esa filtro,
// sino devuelve todos los productos
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const PRODUCTS = await getProducts();
  let filtered = PRODUCTS;

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (brand) {
    filtered = filtered.filter(p => p.brand === brand);
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  return Response.json(filtered);
}