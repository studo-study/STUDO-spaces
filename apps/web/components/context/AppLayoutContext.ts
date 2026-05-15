"use client";

import { createContext, useContext } from "react";

type AppLayoutContextType = {
  toggleCreate: () => void;
};

const AppLayoutContext = createContext<AppLayoutContextType | null>(null);

export function useAppLayout() {
  const ctx = useContext(AppLayoutContext);
  if (!ctx) {
    throw new Error("useAppLayout must be used inside AppLayoutProvider");
  }
  return ctx;
}

export default AppLayoutContext;
