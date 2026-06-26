import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            &copy; {new Date().getFullYear()} ZapasYa. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terminos" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">Términos</Link>
            <Link href="/privacidad" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">Privacidad</Link>
            <Link href="/contacto" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}