"use client";
import { useEffect } from "react";
import { Card } from "@/types/types";
import CardItem from "@/components/ui/public/sets/studosets/carditem";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";

interface CardListProps {
  cards: Card[];
  isOwner: boolean;
  setId: string;
}

export default function CardList({ cards, isOwner, setId }: CardListProps) {
  const setStudosetCards = useStudosetStore((s) => s.setStudosetCards);
  const studosetCards = useStudosetStore((s) => s.studosetCards);

  // Sync server cards into store on mount / when set changes
  useEffect(() => {
    setStudosetCards(cards);
  }, [cards, setStudosetCards]);

  const displayCards = studosetCards.length > 0 ? studosetCards : cards;

  return (
    <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
      {displayCards.map((card, i) => (
        <CardItem
          key={card.id}
          index={i}
          card={card}
          isOwner={isOwner}
          setId={setId}
        />
      ))}
    </div>
  );
}
