import { create } from "zustand";
import { Card } from "@/types/types";
import { CardResponse } from "@studo/types";

interface StudosetStore {
  studosetCards: CardResponse[];
  editingCardId: string | null;
  savingCardIds: string[];
  setStudosetCards: (cards: Card[]) => void;
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

  setStudosetCards: (cards) => set({ studosetCards: cards }),

  updateCardOptimistic: (id, term, definition, term_content_type) => {
    const old = get().studosetCards.find((c) => c.id === id);
    set((state) => ({
      studosetCards: state.studosetCards.map((c) =>
        c.id === id
          ? {
              ...c,
              term,
              definition,
              ...(term_content_type !== undefined && { term_content_type }),
            }
          : c,
      ),
    }));
    return old;
  },

  rollbackCard: (card) =>
    set((state) => ({
      studosetCards: state.studosetCards.map((c) =>
        c.id === card.id ? card : c,
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
