"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import { MdCheck, MdEdit } from "react-icons/md";
import { Card, SessionCard } from "@/types/types";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useUpdateCards } from "@/hooks/app/sets/useUpdateCards";
import LaTeXInput from "@/components/ui/design_system/input/LaTeXInput";
import SafeKaTeX from "@/components/ui/design_system/input/SafeKaTeX";
import { codeToHtml } from "shiki";
import { useTranslations } from "next-intl";
import { BookOpen, Flag } from "lucide-react";
import { useSideMenu } from "@/store/coursecontextmenu/SideMenuStore";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useUpdateSession } from "@/hooks/app/session/useUpdateSession";
import classNames from "@/utils/classnames";
import { useUser } from "@/components/providers/auth/UserProvider";
import { useQueryClient } from "@tanstack/react-query";
import type { FullStudysetResponse } from "@studo/types";

interface CarditemProps {
  index: number;
  fullCard: { card: Card; session: SessionCard | undefined };
  isOwner?: boolean;
  setId?: string;
  isPublic?: boolean;
}

export default function CardItem({
  index,
  fullCard,
  isOwner = false,
  setId,
  isPublic = false,
}: CarditemProps) {
  const {
    studosetCards,
    editingCardId,
    savingCardIds,
    setEditingCardId,
    updateCardOptimistic,
    rollbackCard,
    addSavingCard,
    removeSavingCard,
  } = useStudosetStore();
  const queryClient = useQueryClient();

  const t = useTranslations("studoset");
  const toast = useToast();
  const card = fullCard?.card;
  const sessionCard = fullCard.session!;
  const { updateCards } = useUpdateCards(setId ?? "");

  const updateSession = useUpdateSession(
    sessionCard?.sessionId ?? "",
    setId ?? "",
    {
      invalidateOnSettled: false,
    },
  );
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const userId = useUser().user?.id;
  const currentEntry = studosetCards.find((c) => c.card.id === card.id);
  const currentCard = currentEntry?.card ?? card;
  const currentSession = currentEntry?.session ?? sessionCard;
  const isEditing = editingCardId === card.id;
  const isSaving = savingCardIds.includes(card.id);
  const menuInfo = useSideMenu((state) => state.setMenuInfo);
  const isMenuOpen = useSideMenu((state) => state.menuInfo.isOpen);
  const [editTerm, setEditTerm] = useState(currentCard.term);
  const [editDefinition, setEditDefinition] = useState(currentCard.definition);
  const [contentType, setContentType] = useState(currentCard.termContentType);
  const [codeLanguage, setCodeLanguage] = useState(currentCard.codeLanguage);

  const enterEdit = () => {
    setEditTerm(currentCard.term);
    setEditDefinition(currentCard.definition);
    setContentType(currentCard.termContentType);
    setEditingCardId(card.id);
  };

  const save = useCallback(async () => {
    const term = editTerm.trim();
    const definition = editDefinition.trim();

    setEditingCardId(null);

    if (
      term === currentCard.term &&
      definition === currentCard.definition &&
      contentType === currentCard.termContentType &&
      codeLanguage === currentCard.codeLanguage
    )
      return;

    if (!term || !definition || !setId) return;

    const oldCard = updateCardOptimistic(
      card.id,
      term,
      definition,
      contentType,
    );
    addSavingCard(card.id);

    try {
      await updateCards([
        {
          id: card.id,
          term,
          definition,
          term_content_type: contentType,
          code_language: codeLanguage,
        },
      ]);
    } catch {
      if (oldCard) rollbackCard(oldCard);
      toast.error("Kaart kon niet worden opgeslagen");
    } finally {
      removeSavingCard(card.id);
    }
  }, [
    editTerm,
    editDefinition,
    setEditingCardId,
    currentCard.term,
    currentCard.definition,
    currentCard.termContentType,
    currentCard.codeLanguage,
    contentType,
    codeLanguage,
    setId,
    updateCardOptimistic,
    card.id,
    addSavingCard,
    updateCards,
    rollbackCard,
    toast,
    removeSavingCard,
  ]);

  const handleContainerBlur = useCallback(() => {
    blurTimer.current = setTimeout(() => {
      if (editingCardId === card.id) save();
    }, 100);
  }, [editingCardId, card.id, save]);

  const handleContainerFocus = useCallback(() => {
    clearTimeout(blurTimer.current);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") save();
      if (e.key === "Escape") setEditingCardId(null);
    },
    [save, setEditingCardId],
  );

  const lookUpCourse = useCallback(() => {
    menuInfo({
      isOpen: !isMenuOpen,
      origin: "course",
    });
  }, [isMenuOpen, menuInfo]);

  const flagCard = useCallback(async () => {
    const session = currentSession;
    if (!session || !userId || !setId) return;

    const key = ["studosets", setId];
    const prev = queryClient.getQueryData<FullStudysetResponse>(key);

    // optimistisch in de react-query cache togglen zodat filter + props meelopen
    queryClient.setQueryData<FullStudysetResponse>(key, (old) =>
      old?.session
        ? {
            ...old,
            session: {
              ...old.session,
              cards:
                old.session.cards?.map((c) =>
                  c.id === session.id ? { ...c, flagged: !c.flagged } : c,
                ) ?? null,
            },
          }
        : old,
    );

    try {
      await updateSession.mutateAsync({
        userId,
        cards: [{ id: session.id, flagged: !session.flagged }],
      });
    } catch {
      if (prev) queryClient.setQueryData(key, prev);
      toast.error(t("flag_failed"));
    }
  }, [currentSession, userId, setId, queryClient, updateSession, t, toast]);

  return (
    <div
      className={`w-full overflow-hidden rounded-3xl border bg-studogrey/30 flex flex-col items-center
        transition-all duration-200
        ${isEditing ? "border-emerald-400/40 shadow-lg shadow-emerald-400/5" : "border-studoborder/30"}
        ${isEditing ? "min-h-26 h-fit" : "h-fit min-h-26"}`}
      onBlur={handleContainerBlur}
      onFocus={handleContainerFocus}
    >
      {/* Header */}
      <div className="w-full h-10 bg-studogrey/30 flex pr-2 px-5 py-2 items-center justify-between border-b border-studoborder/30 shrink-0">
        <span className="text-sm">{index + 1}</span>
        <div className={"w-fit flex flex-row items-center gap-2"}>
          {!isPublic && (
            <>
              <BaseTooltip content={t("open_course")}>
                <button
                  type="button"
                  className="rounded-full hover:bg-studogrey px-1 py-1 cursor-pointer transition-all duration-150 flex items-center justify-center w-6 h-6"
                  onClick={lookUpCourse}
                  disabled={isSaving}
                  aria-label={"check in course"}
                >
                  <BookOpen size={14} />
                </button>
              </BaseTooltip>
              <BaseTooltip
                content={
                  currentSession.flagged ? t("unflag_card") : t("flag_card")
                }
              >
                <button
                  type="button"
                  className="rounded-full hover:bg-studogrey px-1 py-1 cursor-pointer transition-all duration-150 flex items-center justify-center w-6 h-6"
                  onClick={flagCard}
                  disabled={isSaving}
                  aria-label={"flag"}
                >
                  <Flag
                    size={14}
                    className={classNames(
                      currentSession.flagged
                        ? "fill-studodarkblue dark:fill-white"
                        : "",
                    )}
                  />
                </button>
              </BaseTooltip>
            </>
          )}

          {isOwner && (
            <BaseTooltip content={isEditing ? t("save") : t("edit")}>
              <button
                type="button"
                className="rounded-full hover:bg-studogrey px-1 py-1 cursor-pointer transition-all duration-150 flex items-center justify-center w-6 h-6"
                onClick={isEditing ? save : enterEdit}
                disabled={isSaving}
                aria-label={isEditing ? "Opslaan" : "Bewerken"}
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                ) : isEditing ? (
                  <MdCheck className="text-emerald-400" size={16} />
                ) : (
                  <MdEdit size={16} title={t("edit")} />
                )}
              </button>
            </BaseTooltip>
          )}
        </div>
      </div>

      <div
        className={`w-full flex px-5 gap-5 py-5 ${isEditing ? "items-start" : "items-center"}`}
      >
        <div className="w-1/2 flex">
          {isEditing ? (
            <LaTeXInput
              value={editTerm}
              onChange={setEditTerm}
              contentType={contentType}
              setContentType={setContentType}
              codeLanguage={codeLanguage}
              onCodeLanguageChange={setCodeLanguage}
              placeholder="Term..."
              onKeyDown={(e) => handleKeyDown(e)}
            />
          ) : currentCard.termContentType === "latex" ? (
            <span className="w-full flex items-center overflow-hidden">
              <SafeKaTeX value={currentCard.term} />
            </span>
          ) : currentCard.termContentType === "code" ? (
            <div className="w-full px-3 h-10 flex items-center border border-studoborder/30 rounded-full bg-studogrey/10 overflow-hidden">
              <CodeBlock
                value={currentCard.term}
                lang={currentCard.codeLanguage}
              />
            </div>
          ) : (
            <span className="w-full px-5 h-10 flex truncate items-center border border-studoborder/30 rounded-full bg-studogrey/10 overflow-hidden text-sm">
              {currentCard.term}
            </span>
          )}
        </div>

        <div className="w-1/2 flex">
          {isEditing ? (
            <LaTeXInput
              value={editDefinition}
              onChange={setEditDefinition}
              contentType={contentType}
              setContentType={setContentType}
              codeLanguage={codeLanguage}
              hidden
              placeholder="Definitie..."
              onKeyDown={(e) => handleKeyDown(e)}
            />
          ) : (
            <div
              className={`w-full flex truncate items-center border border-studoborder/30 rounded-full overflow-hidden bg-studogrey/10 text-sm`}
            >
              <span
                className={`${isPublic && "blur-xs pointer-events-none select-none"} w-full flex truncate items-center px-5 h-10`}
              >
                {currentCard.definition}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CodeBlock = ({ value, lang }: { value: string; lang: string }) => {
  const [html, setHtml] = useState("");
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const theme = isDark ? "github-dark" : "github-light";
    codeToHtml(value, { lang, theme })
      .catch(() => codeToHtml(value, { lang: "text", theme }))
      .then(setHtml);
  }, [value, lang]);
  if (!html) return <span className="font-mono text-xs truncate">{value}</span>;
  return (
    <div
      className="text-xs w-full overflow-hidden [&>pre]:!bg-transparent [&>pre]:p-0 [&>pre]:font-mono [&>pre]:truncate"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
