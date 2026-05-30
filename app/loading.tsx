import Loader from "./components/Loader";

export default function Loading() {
  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="h-16 bg-surface animate-pulse rounded-xl" />
      <div className="border-b px-4 md:px-10 py-4">
        <div className="flex flex-wrap gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 w-24 bg-surface animate-pulse rounded" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    </div>
  );
}
