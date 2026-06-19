import Image from "next/image";

export default function SloganBanner({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const hasFilters = Object.values(searchParams).some((v) => v !== undefined && v !== "");

  if (hasFilters) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <Image
        src="/images/slogan.png"
        alt="Slogan"
        width={1920}
        height={819}
        className="w-full h-auto"
        sizes="100vw"
        quality={100}
        priority
      />
    </div>
  );
}
