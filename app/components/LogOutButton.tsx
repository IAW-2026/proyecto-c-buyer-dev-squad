"use client";
import { useClerk } from "@clerk/nextjs";

export function LogOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => signOut()}
      className="text-sm px-5 py-2.5 rounded-xl btn-primary shadow-sm transition font-medium"
    >
      Sign Out
    </button>
  );
}