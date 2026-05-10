"use client";
import { useClerk } from "@clerk/nextjs";

export function LogInButton() {
  const { openSignIn } = useClerk();

  return (
    <button
      onClick={() =>
        openSignIn({
          forceRedirectUrl: "/", 
        })
      }
      className="text-sm px-5 py-2.5 rounded-xl btn-primary shadow-sm transition font-medium"
    >
      Sign In
    </button>
  );
}