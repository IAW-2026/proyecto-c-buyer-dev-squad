import { Product } from "@/app/types/product";
import { getProducts } from "@/lib/products";
import { getSellerById } from "@/lib/sellers";

//si se le pasa un filtro, devuelve solo los productos de esa filtro,
// sino devuelve todos los productos
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const PRODUCTS = await getProducts();
  let filtered: Product[] = PRODUCTS;

  if (category) {
    filtered = filtered.filter((p: Product) => p.category === category);
  }

  if (brand) {
    filtered = filtered.filter((p: Product) => p.brand === brand);
  }

  if (minPrice) {
    filtered = filtered.filter((p: Product) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p: Product) => p.price <= Number(maxPrice));
  }

  if (search) {
  filtered = filtered.filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  ); //busca por nombre o por marca, lo que incluya el texto de búsqueda, sin importar mayúsculas o minúsculas
  }

  // Agregar información del vendedor
  const productsWithSellers = await Promise.all(
    filtered.map(async (product: Product) => {
      const seller = await getSellerById(product.sellerId);
      return {
        ...product,
        seller,
      };
    })
  );

  return Response.json(productsWithSellers);
}