"use client";
import { useRef, useCallback, useState } from "react";
import { MdCheck, MdEdit } from "react-icons/md";
import { Card } from "@/types/types";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";
import { useToast } from "@/components/providers/app/ToastProvider";
import LaTeXInput from "@/components/ui/design_system/input/LaTeXInput";
import SafeKaTeX from "@/components/ui/design_system/input/SafeKaTeX";

interface CarditemProps {
  index: number;
  card: Card;
  isOwner?: boolean;
  setId?: string;
}

export default function CardItem({
  index,
  card,
  isOwner = false,
  setId,
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

  const toast = useToast();
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const currentCard = studosetCards.find((c) => c.id === card.id) ?? card;
  const isEditing = editingCardId === card.id;
  const isSaving = savingCardIds.includes(card.id);

  const [editTerm, setEditTerm] = useState(currentCard.term);
  const [editDefinition, setEditDefinition] = useState(currentCard.definition);
  const [isLatex, setIsLatex] = useState(currentCard.term_is_latex);

  const enterEdit = () => {
    setEditTerm(currentCard.term);
    setEditDefinition(currentCard.definition);
    setIsLatex(currentCard.term_is_latex);
    setEditingCardId(card.id);
  };

  const save = useCallback(async () => {
    const term = editTerm.trim();
    const definition = editDefinition.trim();

    setEditingCardId(null);

    if (
      term === currentCard.term &&
      definition === currentCard.definition &&
      isLatex === currentCard.term_is_latex
    )
      return;

    if (!term || !definition || !setId) return;

    const oldCard = updateCardOptimistic(card.id, term, definition, isLatex);
    addSavingCard(card.id);

    try {
      const res = await fetch(`/api/studysets/${setId}/cards`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards: [{ id: card.id, term, definition, term_is_latex: isLatex }],
        }),
      });

      if (!res.ok) throw new Error();
    } catch {
      if (oldCard) rollbackCard(oldCard);
      toast.error("Kaart kon niet worden opgeslagen");
    } finally {
      removeSavingCard(card.id);
    }
  }, [
    editTerm,
    editDefinition,
    isLatex,
    card.id,
    currentCard,
    setId,
    updateCardOptimistic,
    rollbackCard,
    addSavingCard,
    removeSavingCard,
    setEditingCardId,
    toast,
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
      <div className="w-full h-10 bg-studogrey/30 flex pr-2 px-5 py-2 items-center justify-between border-b border-studoborder/30 flex-shrink-0">
        <span className="text-sm">{index + 1}</span>

        {isOwner && (
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
              <MdEdit size={16} />
            )}
          </button>
        )}
      </div>

      {/* Card body */}
      <div
        className={`w-full flex px-5 gap-5 py-5 ${isEditing ? "items-start" : "items-center"}`}
      >
        <div className="w-1/2 flex">
          {isEditing ? (
            <LaTeXInput
              value={editTerm}
              onChange={setEditTerm}
              isLatex={isLatex}
              setIsLatex={setIsLatex}
              placeholder="Term..."
              onKeyDown={(e) => handleKeyDown(e)}
            />
          ) : currentCard.term_is_latex ? (
            <span className="w-full flex items-center overflow-hidden">
              <SafeKaTeX value={currentCard.term} />
            </span>
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
              isLatex={isLatex}
              setIsLatex={setIsLatex}
              hidden
              placeholder="Definitie..."
              onKeyDown={(e) => handleKeyDown(e)}
            />
          ) : (
            <span className="w-full px-5 h-10 flex truncate items-center border border-studoborder/30 rounded-full overflow-hidden bg-studogrey/10 text-sm">
              {currentCard.definition}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
