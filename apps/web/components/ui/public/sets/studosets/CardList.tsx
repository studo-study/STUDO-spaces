"use client";
import { useEffect } from "react";
import { Card } from "@/types/types";
import CardItem from "@/components/ui/public/sets/studosets/carditem";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";
import { useTranslations } from "next-intl";
import { MdEdit } from "react-icons/md";
import LinkButton from "@/components/ui/design_system/button/LinkButton";

interface CardListProps {
  cards: Card[];
  isOwner: boolean;
  setId: string;
  isPublic?: boolean;
}

export default function CardList({
  cards,
  isOwner,
  setId,
  isPublic,
}: CardListProps) {
  const t = useTranslations("studoset");
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
          isPublic={isPublic}
        />
      ))}

      {isOwner && (
        <>
          <LinkButton
            href={setId + "/edit"}
            variant={"primary"}
            className={"min-w-full flex-1 w-full"}
            iconLeft={<MdEdit />}
            label={t("edit_set")}
          />
        </>
      )}
    </div>
  );
}
