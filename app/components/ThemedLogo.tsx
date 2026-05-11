"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ThemedLogo() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // función para actualizar el estado
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme(); // estado inicial

    // escuchar cambios del DOM
    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return <div className="w-32 h-8" />;

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