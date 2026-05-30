export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border p-4 rounded-xl block">
          <div className="mb-4 h-40 md:h-48 overflow-hidden rounded-xl bg-surface animate-pulse" />
          <div className="h-5 w-3/4 bg-surface animate-pulse rounded" />
          <div className="mt-2 h-5 w-1/4 bg-surface animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
