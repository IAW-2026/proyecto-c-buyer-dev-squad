"use client";

import { useEffect } from "react";
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";

function ThemeFromUrl() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    if (theme === "light" || theme === "dark") {
      setTheme(theme);
    }
  }, [setTheme]);

  return null;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ThemeFromUrl />
      {children}
    </NextThemesProvider>
  );
}
