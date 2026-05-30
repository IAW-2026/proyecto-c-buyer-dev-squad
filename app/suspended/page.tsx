import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LogOutButton } from "../components/LogOutButton";
import { getUserByClerkId } from "@/lib/services/User.service";

export default async function SuspendedPage() {
  const { userId } = await auth();

  if (!userId) redirect("/");

  const user = await getUserByClerkId(userId);

  if (user?.status !== "SUSPENDED") redirect("/");

  return (
    <main className="flex items-center justify-center min-h-screen bg-surface-alt px-4">
      <div className="max-w-md w-full text-center bg-surface border border-muted rounded-2xl shadow-xl p-8">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Cuenta suspendida
        </h1>
        <p className="text-muted mb-6">
          Usted ha sido suspendido. No puede acceder al sistema. Por favor,
          comuníquese con el administrador para más información.
        </p>
        <div className="flex justify-center">
          <LogOutButton />
        </div>
      </div>
    </main>
  );
}
