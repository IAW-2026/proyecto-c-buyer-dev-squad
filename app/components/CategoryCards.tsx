import Link from "next/link";

const categories = [
  {
    title: "Hombre",
    slug: "hombre",
    description: "Colección completa para hombre",
    image: "/images/nike-dunk.jpg",
  },
  {
    title: "Mujer",
    slug: "mujer",
    description: "Diseño y estilo para ella",
    image: "/images/air-max-270.jpg",
  },
  {
    title: "Niño/as",
    slug: "nino",
    description: "Comodidad para los más chicos",
    image: "/images/adidas-child.jpg",
  },
];

export default function CategoryCards() {
  return (
    <section className="w-full py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] tracking-tight">
            Comprá por
            <br />
            <span className="text-[var(--color-primary)]">categoría</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tienda?category=${cat.slug}`}
              className="group relative h-[320px] md:h-[420px] rounded-3xl overflow-hidden bg-[var(--color-surface-alt)]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/90 via-[var(--color-background)]/20 to-transparent z-10" />
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] mb-1">
                  {cat.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] mb-3">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] group-hover:gap-3 transition-all duration-300">
                  Ver colección
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
