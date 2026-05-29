"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemedLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Link href="/">
        <Image
          src="/LogoLight.jpg"
          alt="Logo"
          width={180}
          height={40}
          priority
        />
      </Link>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Link href="/">
      <Image
        src={isDark ? "/LogoDark.jpg" : "/LogoLight.jpg"}
        alt="Logo"
        width={180}
        height={40}
        priority
      />
    </Link>
  );
}