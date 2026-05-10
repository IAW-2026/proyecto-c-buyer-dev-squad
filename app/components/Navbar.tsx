import { SignInButton} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { LogOutButton } from "./LogOutButton";
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logo.jpg"
        alt="ZapasYa logo"
        width={180}
        height={40}
        className="object-contain"
        priority
      />
    </Link>
  );
}

export default async function Navbar() {
  const user = await currentUser();

return (
  <nav className="w-full sticky top-0 z-50 border-b border-muted bg-surface-alt shadow-sm">
    
    <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">
      
      <div className="scale-110">
        <Logo />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.imageUrl}
              alt={user.fullName ?? "Avatar"}
              className="w-10 h-10 rounded-full object-cover border border-muted shadow-sm"
            />

          <LogOutButton />
          </div>
        ) : (
          <SignInButton>
            <button className="text-sm px-5 py-2.5 rounded-xl btn-primary shadow-sm transition font-medium">
              Sign In
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  </nav>
);
}