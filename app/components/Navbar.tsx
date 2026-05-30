import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogInButton } from "./LogInButton";
import ThemedLogo from "./ThemedLogo";
import ThemeToggle from "./ThemeToggle";
import { UserAvatarMenu } from "./UserAvatarMenu";
import { getNavbarUser } from "@/lib/services/User.service";

export default async function Navbar() {
  const user = await currentUser();

  let isAdmin = false;
  let dbUser = null;

  if (user) {
    dbUser = await getNavbarUser(user.id);
  }
    isAdmin = dbUser?.role === "ADMIN";

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-muted bg-surface-alt shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-2 sm:px-4 md:px-6 h-14 sm:h-16 md:h-20">

        <div className="scale-90 sm:scale-100 md:scale-110">
          <ThemedLogo />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
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