export async function GET() {
  const products = [
    {
      id: "1",
      name: "Nike Air Force 1",
      price: 120,
    },
    {
      id: "2",
      name: "Adidas Forum Low",
      price: 95,
    },
  ];

  return Response.json(products);
}