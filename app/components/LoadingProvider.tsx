"use client";

import { createContext, useContext, useTransition, type ReactNode } from "react";

interface LoadingContextValue {
  isPending: boolean;
  startTransition: (cb: () => void) => void;
}

const LoadingContext = createContext<LoadingContextValue>({
  isPending: false,
  startTransition: (cb) => cb(),
});

export function useLoading() {
  return useContext(LoadingContext);
}

export default function LoadingProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <LoadingContext.Provider value={{ isPending, startTransition }}>
      {children}
    </LoadingContext.Provider>
  );
}
