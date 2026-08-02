import { create } from "zustand";
import { Card, SessionCard } from "@/types/types";

interface StudosetStore {
  studosetCards: { card: Card; session: SessionCard | undefined }[];
  editingCardId: string | null;
  savingCardIds: string[];
  setStudosetCards: (cards: Card[], sessionCards: SessionCard[]) => void;
  updateCardOptimistic: (
    id: string,
    term: string,
    definition: string,
    term_content_type?: "text" | "latex" | "code",
  ) => Card | undefined;
  rollbackCard: (card: Card) => void;
  setEditingCardId: (id: string | null) => void;
  addSavingCard: (id: string) => void;
  removeSavingCard: (id: string) => void;
}

export const useStudosetStore = create<StudosetStore>()((set, get) => ({
  studosetCards: [],
  editingCardId: null,
  savingCardIds: [],

  setStudosetCards: (cards, sessionCards) =>
    set({
      studosetCards: cards.map((card) => ({
        card: card,
        session: sessionCards.find((seshcard) => seshcard.cardId === card.id),
      })),
    }),
  updateCardOptimistic: (id, term, definition, term_content_type) => {
    const old = get().studosetCards.find((c) => c.card.id === id)?.card;
    set((state) => ({
      studosetCards: state.studosetCards.map((c) =>
        c.card.id === id
          ? {
              ...c,
              card: {
                ...c.card,
                term,
                definition,
                ...(term_content_type !== undefined && { term_content_type }),
              },
            }
          : c,
      ),
    }));
    return old;
  },

  rollbackCard: (card) =>
    set((state) => ({
      studosetCards: state.studosetCards.map((c) =>
        c.card.id === card.id ? { ...c, card } : c,
      ),
    })),

  setEditingCardId: (id) => set({ editingCardId: id }),

  addSavingCard: (id) =>
    set((state) => ({ savingCardIds: [...state.savingCardIds, id] })),

  removeSavingCard: (id) =>
    set((state) => ({
      savingCardIds: state.savingCardIds.filter((sid) => sid !== id),
    })),
}));
