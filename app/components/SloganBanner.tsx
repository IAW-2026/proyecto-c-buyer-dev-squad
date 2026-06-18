import Image from "next/image";

export default function SloganBanner({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const hasFilters = Object.values(searchParams).some((v) => v !== undefined && v !== "");

  if (hasFilters) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <Image
        src="/images/slogan.png"
        alt="Slogan"
        width={800}
        height={400}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}
