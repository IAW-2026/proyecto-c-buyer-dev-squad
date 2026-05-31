"use client";

import { type ReactNode } from "react";
import { useLoading } from "./LoadingProvider";
import ProductGridSkeleton from "./ProductGridSkeleton";

export default function ProductsWrapper({ children }: { children: ReactNode }) {
  const { isPending } = useLoading();

  if (isPending) {
    return <ProductGridSkeleton />;
  }

  return <>{children}</>;
}
