import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogInButton } from "./LogInButton";
import ThemedLogo from "./ThemedLogo";
import ThemeToggle from "./ThemeToggle";
import { UserAvatarMenu } from "./UserAvatarMenu";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const user = await currentUser();
  const { userId } = await auth();

  let isAdmin = false;
  let dbUser = null;

  if (userId) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        birthDate: true,
      },
    });
    isAdmin = dbUser?.role === "ADMIN";
  }

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-muted bg-surface-alt shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 h-16 md:h-20">

        <div className="scale-110">
          <ThemedLogo />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-muted hover:bg-surface transition-colors text-muted"
            >
              Admin
            </Link>
          )}
          {user && dbUser ? (
            <UserAvatarMenu
              imageUrl={user.imageUrl}
              fullName={user.fullName}
              dbUser={{
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
                phone: dbUser.phone,
                address: dbUser.address,
                birthDate: dbUser.birthDate,
              }}
            />
          ) : (
            <LogInButton />
          )}
        </div>
      </div>
    </nav>
  );
}