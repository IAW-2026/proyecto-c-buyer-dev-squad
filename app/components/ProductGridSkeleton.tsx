export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-2xl overflow-hidden bg-[var(--color-surface-alt)]">
          <div className="aspect-square w-full bg-[var(--color-surface)] animate-pulse" />
          <div className="flex flex-col gap-2 p-4 md:p-5">
            <div className="h-3 w-16 rounded bg-[var(--color-surface)] animate-pulse" />
            <div className="h-4 w-full rounded bg-[var(--color-surface)] animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-[var(--color-surface)] animate-pulse" />
            <div className="flex gap-1 mt-1">
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-surface)] animate-pulse" />
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-surface)] animate-pulse" />
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-surface)] animate-pulse" />
            </div>
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--color-border)]/50">
              <div className="h-5 w-16 rounded bg-[var(--color-surface)] animate-pulse" />
              <div className="h-3 w-20 rounded bg-[var(--color-surface)] animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
