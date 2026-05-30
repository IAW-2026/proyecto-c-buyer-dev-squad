import { auth} from "@clerk/nextjs/server";
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

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true, status: true, firstName: true, lastName: true, email: true },
  });

  if (!dbUser) redirect("/");

  if (dbUser.status === "SUSPENDED") redirect("/suspended");

  if (dbUser.role !== "ADMIN") redirect("/");

  return (
    <div className="admin-layout">
      <AdminSidebar user={dbUser} />
      <main className="admin-main">{children}</main>
    </div>
  );
}