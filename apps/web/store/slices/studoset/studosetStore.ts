import { create } from "zustand";
import { Card } from "@/types/types";

interface StudosetStore {
  studosetCards: Card[];
  editingCardId: string | null;
  savingCardIds: string[];
  setStudosetCards: (cards: Card[]) => void;
  updateCardOptimistic: (
    id: string,
    term: string,
    definition: string,
    term_is_latex?: boolean,
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

  updateCardOptimistic: (id, term, definition, term_is_latex) => {
    const old = get().studosetCards.find((c) => c.id === id);
    set((state) => ({
      studosetCards: state.studosetCards.map((c) =>
        c.id === id
          ? {
              ...c,
              term,
              definition,
              ...(term_is_latex !== undefined && { term_is_latex }),
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
