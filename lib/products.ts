import { prisma } from "@/lib/prisma";
import { syncSellers } from "@/lib/sellers";
const PRODUCTS = [
  {
    id: "1",
    name: "Nike Vomero Premium",
    price: 449.999,
    brand: "nike",
    image: "/images/nike.jpg",
    description: "Zapatilla deportiva de alta calidad ideal para uso diario y rendimiento.",
    category: "mujer",
    sizes: [36, 37, 38, 39, 40, 41],
    sellerId: "seller-1",
  },
  {
    id: "2",
    name: "Adizero Adios PRO 4",
    price: 419.999,
    brand: "adidas",
    image: "/images/adidas.jpg",
    description: "Zapatilla de running de alto rendimiento diseñada para corredores serios.",
    category: "mujer",
    sizes: [36, 37, 38, 39, 40, 41],
    sellerId: "seller-2",
  },
  {
    id: "3",
    name: "Nike Dunk Low Retro",
    price: 249.999,
    brand: "nike",
    image: "/images/nike-dunk.jpg",
    description: "Zapatilla icónica de estilo urbano con diseño retro y comodidad moderna.",
    category: "hombre",
    sizes: [40, 41, 42, 43, 44, 45],
    sellerId: "seller-1",
  },
  {
    id: "4",
    name: "Air Jordan 1 Mid SE",
    price: 429.999,
    brand: "nike",
    image: "/images/nike-air.jpg",
    description: "Zapatilla urbana clásica con diseño moderno y detalles premium.",
    category: "mujer",
    sizes: [36, 37, 38, 39, 40, 41],
    sellerId: "seller-1",
  },
  {
    id: "5",
    name: "Air Jordan 1 Mid SE",
    price: 132.999,
    brand: "nike",
    image: "/images/nike-gt.jpg",
    description: "Zapatilla de baloncesto clásica con diseño moderno y detalles premium.",
    category: "nino",
    sizes: [28, 29, 30, 31, 32, 33],
    sellerId: "seller-1",
  },
  {
    id: "6",
    name: "Zapatillas de running Adizero Drive RC",
    price: 132.999,
    brand: "adidas",
    image: "/images/adidas-pro.jpg",
    description: "Zapatilla de running ligera y reactiva diseñada para corredores de nivel intermedio.",
    category: "mujer",
    sizes: [36, 37, 38, 39, 40, 41],
    sellerId: "seller-2",
  },
  {
    id: "7",
    name: "Adizero Adios PRO 4",
    price: 419.999,
    brand: "adidas",
    image: "/images/adidas-proh.jpg",
    description: "Zapatilla de running de alto rendimiento diseñada para corredores serios.",
    category: "hombre",
    sizes: [40, 41, 42, 43, 44, 45],
    sellerId: "seller-2",
  },
  {
    id: "8",
    name: "Campus 00s Comfort Closure con Cordones Elásticos",
    price: 419.999,
    brand: "adidas",
    image: "/images/adidas-child.jpg",
    description: "Zapatilla urbana de estilo retro con cierre de cordones elásticos para niños.",
    category: "nino",
    sizes: [28, 29, 30, 31, 32, 33],
    sellerId: "seller-2",
  },
];

async function syncProducts() {
  await syncSellers(); //necesitamos asegurarnos de que los 
  // sellers existan antes de crear los productos
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        brand: p.brand,
        image: p.image,
        description: p.description,
        category: p.category,
        sizes: p.sizes,
        sellerId: p.sellerId,
      },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        brand: p.brand,
        image: p.image,
        description: p.description,
        category: p.category,
        sizes: p.sizes,
        sellerId: p.sellerId,
      },
    });
  }
}

// Se ejecuta automáticamente cuando Next.js carga este archivo
syncProducts().catch(console.error);

export async function getProducts() {
  return prisma.product.findMany(); // ahora lee de la BD
}