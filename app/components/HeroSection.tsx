"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { getSellerDashboardUrl } from "@/lib/actions/Seller.actions";
import Link from "next/link";

const SELLER_URL = `${process.env.NEXT_PUBLIC_SELLER_URL}/dashboard`;

const heroImages = [
  "/images/adidas.jpg",
  "/images/ultraboost.jpg",
  "/images/nike.jpg",
];

export default function HeroSection() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [loadingSellerUrl, setLoadingSellerUrl] = useState(false);

  const handleCatalogClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: SELLER_URL });
      return;
    }

    setLoadingSellerUrl(true);
    try {
      const url = await getSellerDashboardUrl(resolvedTheme);
      router.push(url);
    } catch (err) {
      console.error("No se pudo generar el link del seller dashboard:", err);
      router.push(SELLER_URL);
    } finally {
      setLoadingSellerUrl(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[85vh] flex items-start overflow-hidden bg-[var(--color-background)] pt-20 md:pt-24">
      {heroImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: i === currentImage ? 1 : 0,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)] via-[var(--color-background)]/90 to-transparent md:via-[var(--color-background)]/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent z-10" />
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover object-center"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      <div className="relative z-20 w-full px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/60 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />

            <span className="text-xs md:text-sm font-medium text-[var(--color-foreground)] tracking-normal">
              Nuevos productos
            </span>

            <span className="text-xs md:text-sm text-[var(--color-muted)] font-medium">
              +1.200 esta semana
            </span>
          </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-[var(--color-foreground)] tracking-tighter leading-[0.9] mb-4">
              Tu estilo
              <br />
              <span className="text-[var(--color-primary)]">en cada paso</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-lg mb-8 leading-relaxed">
              Las mejores marcas, los lanzamientos más exclusivos. Encontrá tus zapatillas ideales.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/tienda"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold text-base rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Comprar ahora</span>
                <span className="absolute inset-0 bg-[var(--color-foreground)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </Link>
              <a
                href={SELLER_URL}
                onClick={handleCatalogClick}
                aria-disabled={loadingSellerUrl}
                className="group relative inline-flex items-center justify-center px-8 py-4 border-2 border-[var(--color-border)] text-[var(--color-foreground)] font-semibold text-base rounded-full overflow-hidden transition-all duration-500 hover:border-[var(--color-primary)] hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">{loadingSellerUrl ? "Generando link..." : "Quiero vender"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentImage
                ? "w-8 bg-[var(--color-primary)]"
                : "w-1.5 bg-[var(--color-border)] hover:bg-[var(--color-muted)]"
            }`}
            aria-label={`Imagen ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
