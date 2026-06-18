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
import { Store } from "lucide-react";
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

  const isAdmin = (user?.publicMetadata?.role as string) === "ADMIN";

  if (dbUser?.status === "SUSPENDED") {
    return (
      <nav className="w-full sticky top-0 z-50 border-b border-destructive/30 bg-destructive/5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-2 sm:px-4 md:px-6 h-14 sm:h-16 md:h-20">
          <div className="scale-90 sm:scale-100 md:scale-110">
            <ThemedLogo />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-destructive font-medium">
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
      <nav className="w-full sticky top-0 z-50 border-b border-muted bg-surface-alt shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-2 sm:px-4 md:px-6 h-14 sm:h-16 md:h-20">
          <div className="scale-90 sm:scale-100 md:scale-110">
            <ThemedLogo />
          </div>
          <Loader size="sm" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-muted bg-surface-alt shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-2 sm:px-4 md:px-6 h-14 sm:h-16 md:h-20">
        <div className="scale-90 sm:scale-100 md:scale-110">
          <ThemedLogo />
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <a
            href="https://proyecto-c-seller-dev-squad.vercel.app/"
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            <Store className="w-4 h-4" />
            Vender
          </a>
          <ThemeToggle />
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-muted hover:bg-surface transition-colors text-muted"
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
