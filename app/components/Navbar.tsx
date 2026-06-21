"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getNavbarUserAction } from "@/lib/actions/User.actions";
import { getSellerDashboardUrl } from "@/lib/actions/Seller.actions";
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

const SELLER_URL = `${process.env.NEXT_PUBLIC_SELLER_URL}/dashboard`;
export default function Navbar() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn } = useClerk();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingSellerUrl, setLoadingSellerUrl] = useState(false);

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

  const handleVenderClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: SELLER_URL });
      return;
    }

    setLoadingSellerUrl(true);
    try {
      const url = await getSellerDashboardUrl();
      router.push(url);
    } catch (err) {
      console.error("No se pudo generar el link del seller dashboard:", err);
      // Fallback: lleva igual al dashboard, sin token de handoff.
      router.push(SELLER_URL);
    } finally {
      setLoadingSellerUrl(false);
    }
  };

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
            href={SELLER_URL}
            onClick={handleVenderClick}
            aria-disabled={loadingSellerUrl}
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <Store className="w-4 h-4" />
            {loadingSellerUrl ? "Generando link..." : "Vender"}
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