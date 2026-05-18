import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "../components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  // Verificar rol ADMIN en la base de datos
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true, firstName: true, lastName: true, email: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="admin-layout">
      <AdminSidebar user={dbUser} />
      <main className="admin-main">{children}</main>
    </div>
  );
}