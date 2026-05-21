"use client";
import { useQueryClient } from "@tanstack/react-query";
import SplashProvider from "@/components/providers/app/SplashProvider";
import type { FullStudysetResponse } from "@studo/types";

export default function StudosetSplashWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<FullStudysetResponse>([
    "studosets",
    id,
  ]);
  const alreadyLoaded = !!cached?.cards;

  return (
    <SplashProvider initialLoaded={alreadyLoaded}>{children}</SplashProvider>
  );
}
