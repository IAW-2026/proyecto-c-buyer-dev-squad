import { prisma } from "@/lib/prisma";

const SELLERS = [
  {
    id: "seller-1",
    clerkId: "clerk_seller_1",
    businessName: "Nike Official Store",
    email: "contact@nike.com",
    firstName: "Nike",
    lastName: "Store",
  },
  {
    id: "seller-2",
    clerkId: "clerk_seller_2",
    businessName: "Adidas Store",
    email: "contact@adidas.com",
    firstName: "Adidas",
    lastName: "Store",
  },
];

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
    colors: ["Blanco", "Negro", "Rosa"],
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
    colors: ["Blanco", "Azul", "Negro"],
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
    colors: ["Blanco", "Negro", "Rojo"],
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
    colors: ["Blanco", "Negro", "Dorado"],
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
    colors: ["Rojo", "Blanco", "Negro"],
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
    colors: ["Blanco", "Azul", "Rosado"],
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
    colors: ["Negro", "Gris", "Blanco"],
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
    colors: ["Blanco", "Azul", "Verde"],
    sellerId: "seller-2",
  },
];


async function main() {
  console.log("Seeding database...");

  for (const seller of SELLERS) {
    await prisma.seller.upsert({
      where: { id: seller.id },
      update: {
        businessName: seller.businessName,
        email: seller.email,
        firstName: seller.firstName,
        lastName: seller.lastName,
      },
      create: seller,
    });
  }

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        price: product.price,
        brand: product.brand,
        image: product.image,
        description: product.description,
        category: product.category,
        sizes: product.sizes,
        colors: product.colors,
        sellerId: product.sellerId,
      },
      create: product,
    });
  }

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });