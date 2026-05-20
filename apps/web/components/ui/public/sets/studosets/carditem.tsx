"use client";
import { useRef, useCallback } from "react";
import { MdCheck, MdEdit } from "react-icons/md";
import { Card } from "@/types/types";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";
import { useToast } from "@/components/providers/ToastProvider";

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
  const termRef = useRef<HTMLInputElement>(null);
  const definitionRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>();

  const currentCard = studosetCards.find((c) => c.id === card.id) ?? card;
  const isEditing = editingCardId === card.id;
  const isSaving = savingCardIds.includes(card.id);

  const enterEdit = () => {
    setEditingCardId(card.id);
    requestAnimationFrame(() => termRef.current?.focus());
  };

  const save = useCallback(async () => {
    const term = termRef.current?.value?.trim() ?? currentCard.term;
    const definition =
      definitionRef.current?.value?.trim() ?? currentCard.definition;

    setEditingCardId(null);

    // No change — skip the network call
    if (term === currentCard.term && definition === currentCard.definition) {
      return;
    }

    if (!term || !definition || !setId) return;

    const oldCard = updateCardOptimistic(card.id, term, definition);
    addSavingCard(card.id);

    try {
      const res = await fetch(`/api/studysets/${setId}/cards`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards: [{ id: card.id, term, definition }],
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

  // Auto-save when focus leaves the entire card container
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
        ${isEditing ? "min-h-36 h-fit" : "h-36"}`}
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
      <div className="w-full flex-1 flex px-5 gap-5 py-3 items-center">
        {/* Term — 1/3 */}
        <div className="w-1/3 h-full flex items-center">
          {isEditing ? (
            <input
              ref={termRef}
              defaultValue={currentCard.term}
              maxLength={128}
              placeholder="Term..."
              onKeyDown={handleKeyDown}
              className="w-full px-4 h-11 border border-emerald-400/40 rounded-full
                bg-studogrey/10 focus:outline-none focus:border-emerald-400
                text-sm transition-colors dark:text-white"
            />
          ) : (
            <span
              className="w-full px-5 h-11 flex truncate items-center border
                border-studoborder/30 rounded-full bg-studogrey/10 overflow-hidden text-sm"
            >
              {currentCard.term}
            </span>
          )}
        </div>

        {/* Definition — 2/3 */}
        <div className="w-2/3 h-full flex items-center">
          {isEditing ? (
            <input
              ref={definitionRef}
              defaultValue={currentCard.definition}
              maxLength={128}
              placeholder="Definitie..."
              onKeyDown={handleKeyDown}
              className="w-full px-4 h-11 border border-emerald-400/40 rounded-full
                bg-studogrey/10 focus:outline-none focus:border-emerald-400
                text-sm transition-colors dark:text-white"
            />
          ) : (
            <span
              className="w-full px-5 h-11 flex truncate items-center border
                border-studoborder/30 rounded-full overflow-hidden bg-studogrey/10 text-sm"
            >
              {currentCard.definition}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
