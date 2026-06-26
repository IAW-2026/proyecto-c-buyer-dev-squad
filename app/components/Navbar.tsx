"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useTransition } from "react";
import { getNavbarUserAction } from "@/lib/actions/User.actions";
import Loader from "./Loader";
import ThemedLogo from "./ThemedLogo";
import ThemeToggle from "./ThemeToggle";
import { LogInButton } from "./LogInButton";
import { LogOutButton } from "./LogOutButton";
import { UserAvatarMenu } from "./UserAvatarMenu";
import Link from "next/link";

type DbUser = {
  status: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  birthDate: Date | null;
};

export default function Navbar() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      startTransition(async () => {
        try {
          const data = await getNavbarUserAction();
          setDbUser(data);
        } catch (e) {
          console.error(e);
        }
      });
    } else {
      setDbUser(null);
    }
  }, [isSignedIn, isLoaded]);

  const isAdmin = (user?.publicMetadata?.role as string) === "admin";

  const navClasses = "w-full sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]/80 backdrop-blur-lg shadow-sm";

  const containerClasses = "max-w-6xl mx-auto flex items-center justify-between px-2 sm:px-4 md:px-6 h-14 sm:h-16 md:h-20";

  const Logo = (
    <div className="scale-90 sm:scale-100 md:scale-110">
      <ThemedLogo />
    </div>
  );

  if (dbUser?.status === "SUSPENDED") {
    return (
      <nav className={navClasses}>
        <div className={containerClasses}>
          {Logo}
          <div className="flex items-center gap-4">
            <span className="text-sm text-danger font-medium">
              Cuenta suspendida
            </span>
            <LogOutButton />
          </div>
        </div>
      </nav>
    );
  }

  if (!isLoaded) {
    return (
      <nav className={navClasses}>
        <div className={containerClasses}>
          {Logo}
          <Loader size="sm" />
        </div>
      </nav>
    );
  }

  return (
    <nav className={navClasses}>
      <div className={containerClasses}>
        {Logo}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

          <ThemeToggle />
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium px-3 py-1.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Admin
            </Link>
          )}
          {isSignedIn && user ? (
            <UserAvatarMenu
              imageUrl={user.imageUrl}
              fullName={user.fullName}
              dbUser={{
                firstName: dbUser?.firstName,
                lastName: dbUser?.lastName,
                phone: dbUser?.phone,
                address: dbUser?.address,
                birthDate: dbUser?.birthDate ?? null,
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