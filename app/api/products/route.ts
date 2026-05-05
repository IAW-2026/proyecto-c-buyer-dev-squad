export async function GET() {
  const products = [
    {
      id: "1",
      name: "Nike Vomero Premium",
      price: 449.999,
      image: "/images/nike.jpg",
    },
    {
      id: "2",
      name: "Adizero Adios PRO 4",
      price: 419.999,
      image: "/images/adidas.jpg",
    },
  ];

  return Response.json(products);
}