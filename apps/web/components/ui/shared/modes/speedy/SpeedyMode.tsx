"use client";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { useMemo } from "react";
import { Card } from "@/types/types";
import SpeedyModeInner from "@/components/ui/shared/modes/speedy/SpeedyModeInner";

interface SpeedyModeProps {
  id: string;
}

export default function SpeedyMode({ id }: SpeedyModeProps) {
  const data = useStudoset(id)?.data;
  const sessionCards = data?.session?.cards ?? [];
  const cards = useMemo<Card[]>(() => data?.cards ?? [], [data]);

  if (cards.length === 0 || !data?.session) {
    return null;
  }

  return (
    <SpeedyModeInner
      id={id}
      cards={cards}
      sessionCards={sessionCards}
      session={data.session} // TS weet nu dat dit defined is
    />
  );
}
