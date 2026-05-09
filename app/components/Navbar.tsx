import { SignInButton, SignOutButton} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-4 border-b">
      <h1 className="font-bold text-xl">ZapasYa</h1>
      <SignInButton />
      <SignOutButton />
    </nav>
  );
}