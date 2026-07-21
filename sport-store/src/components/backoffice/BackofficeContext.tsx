"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface BackofficeContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

const Ctx = createContext<BackofficeContextValue | null>(null);

export function BackofficeProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Ctx.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBackoffice(): BackofficeContextValue {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useBackoffice must be used within BackofficeProvider");
  return ctx;
}
