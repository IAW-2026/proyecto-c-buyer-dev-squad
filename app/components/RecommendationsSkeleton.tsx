export default function RecommendationsSkeleton() {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-6 md:h-7 w-1 rounded-full bg-[var(--color-surface)] animate-pulse" />
            <div className="h-7 w-24 rounded bg-[var(--color-surface)] animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl overflow-hidden bg-[var(--color-surface-alt)]"
            >
              <div className="aspect-square w-full bg-[var(--color-surface)] animate-pulse" />
              <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
                <div className="h-3 w-12 rounded bg-[var(--color-surface)] animate-pulse" />
                <div className="h-4 w-full rounded bg-[var(--color-surface)] animate-pulse" />
                <div className="h-4 w-16 rounded bg-[var(--color-surface)] animate-pulse mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}