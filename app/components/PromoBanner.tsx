import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300">
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white dark:bg-black" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white dark:bg-black" />
          </div>
          <div className="relative z-10 px-8 py-12 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-white/60 dark:text-black/50 tracking-wider uppercase mb-2">
                Oferta especial
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-black tracking-tight leading-tight">
                Envío gratis <br />
                <span className="text-white/90 dark:text-black/80">a sucursal</span>
              </h2>
            </div>
            <Link
              href="/tienda"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-semibold text-base rounded-full transition-all duration-500 hover:scale-105 active:scale-95 hover:shadow-xl shrink-0"
            >
              Aprovechar oferta
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
