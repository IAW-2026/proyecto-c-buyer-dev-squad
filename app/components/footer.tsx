export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            &copy; {new Date().getFullYear()} ZapasYa. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[var(--color-muted)]">Términos</span>
            <span className="text-xs text-[var(--color-muted)]">Privacidad</span>
            <span className="text-xs text-[var(--color-muted)]">Contacto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}