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

  const clerkUser = await currentUser();
  const role = clerkUser?.publicMetadata?.role as string | undefined;
  if (role !== "ADMIN") redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { status: true },
  });

  if (!dbUser) redirect("/");
  if (dbUser.status === "SUSPENDED") redirect("/suspended");

  return (
    <div className="admin-layout">
      <AdminSidebar
        user={{
          firstName: clerkUser?.firstName ?? null,
          lastName: clerkUser?.lastName ?? null,
          email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        }}
      />
      <main className="admin-main">{children}</main>
    </div>
  );
}