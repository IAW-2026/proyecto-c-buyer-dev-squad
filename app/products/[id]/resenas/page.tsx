import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ResenasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/");
  // Acá después vas a hacer una consulta a tu API para traer las reseñas del producto usando el id de params.id
  // const res = await fetch(`/api/reviews/${params.id}`);
  // const reviews = await res.json();

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 max-w-4xl mx-auto">
      <Link href={`/products/${id}`} className="text-muted underline text-sm">
        ← Volver al producto
      </Link>

      <h1 className="text-2xl font-bold text-foreground mt-4 mb-6">
        Reseñas del producto
      </h1>

      <div className="bg-surface-alt border border-muted rounded-2xl p-6">
        <p className="text-muted">
          Acá se muestran las reseñas del producto #{id}
        </p>
      </div>
    </main>
  );
}