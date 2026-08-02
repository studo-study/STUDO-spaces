"use client";
import { useEffect } from "react";
import CardItem from "@/components/ui/app/shared/studosets/carditem";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";
import { useTranslations } from "next-intl";
import { MdEdit } from "react-icons/md";
import LinkButton from "@/components/ui/design_system/button/LinkButton";
import {
  CardResponse,
  SessionCardResponse,
  StudysessionListResponse,
  StudysessionResponse,
} from "@studo/types";

interface CardListProps {
  cards: CardResponse[] | undefined;
  session: SessionCardResponse[];
  isOwner: boolean;
  setId: string;
  isPublic?: boolean;
}

export default function CardList({
  cards,
  session,
  isOwner,
  setId,
  isPublic,
}: CardListProps) {
  const t = useTranslations("studoset");
  const setStudosetCards = useStudosetStore((s) => s.setStudosetCards);
  const studosetCards = useStudosetStore((s) => s.studosetCards);

  // Sync server cards into store on mount / when set changes
  useEffect(() => {
    setStudosetCards(cards ?? [], session ?? []);
  }, [cards, session, setStudosetCards]);

  const displayCards = studosetCards.length > 0 ? studosetCards : [];

  return (
    <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
      {cards?.length === 0 && (
        <div
          className={
            "w-full min-h-50 h-50 max-h-50 flex justify-center items-center dark:text-studogrey text-black/20 font-medium"
          }
        >
          <span>{t("no_cards")}</span>
        </div>
      )}
      {displayCards?.map((card, i) => (
        <CardItem
          key={card?.card?.id}
          index={i}
          fullCard={card}
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
