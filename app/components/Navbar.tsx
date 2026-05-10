import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
export default async function Navbar() {
  const user = await currentUser();

  return (
    <nav className="w-full flex items-center justify-between p-4 border-b">
      <h1 className="font-bold text-xl">ZapasYa</h1>

      {user ? (
        <div className="flex items-center gap-3">
          <img
            src={user.imageUrl}
            alt={user.fullName ?? "Avatar"}
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </nav>
  );
}