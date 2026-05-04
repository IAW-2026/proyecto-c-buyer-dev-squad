import CartList from "../components/CartList";

async function getCart() {
  const res = await fetch("http://localhost:3000/api/cart", {
    cache: "no-store",
  });
  return res.json();
}

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });
  return res.json();
}

export default async function CartPage() {
  const cart = await getCart();
  const products = await getProducts();
  
  const cartWithProducts = cart.map((item: any) => {
    const product = products.find((p: any) => p.id === item.productId);
    //busca los productos de los ids del carrito
    return {
      ...item,
      name: product?.name,
      price: product?.price,
    };
  });
  const total = cartWithProducts.reduce(
  (acc: number, item: any) => acc + item.price * item.quantity,
  0
  );
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Carrito</h1>

      {cartWithProducts.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <CartList items={cartWithProducts} total={total} />
      )}
    </main>
  );
}