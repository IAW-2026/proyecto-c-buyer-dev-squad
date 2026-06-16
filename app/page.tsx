import Link from "next/link";
import { Store, ShoppingBag } from "lucide-react";
import ThemedLogo from "./components/ThemedLogo";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-12">
      <div className="scale-150">
        <ThemedLogo />
      </div>

      <p className="text-lg text-muted text-center max-w-md">
        Elegí cómo querés entrar a ZapasYa
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <Link
          href="https://proyecto-c-seller-dev-squad.vercel.app/"
          className="flex-1 flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-muted bg-surface-alt hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <Store className="w-12 h-12 text-muted group-hover:text-primary transition-colors" />
          <span className="text-xl font-semibold">Vendedor</span>
          <span className="text-sm text-muted text-center">
            Accedé a tu tienda y gestioná tus productos
          </span>
        </Link>

        <Link
          href="/home"
          className="flex-1 flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-muted bg-surface-alt hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <ShoppingBag className="w-12 h-12 text-muted group-hover:text-primary transition-colors" />
          <span className="text-xl font-semibold">Comprador</span>
          <span className="text-sm text-muted text-center">
            Explorá y comprá las mejores zapatillas
          </span>
        </Link>
      </div>
    </div>
  );
}
