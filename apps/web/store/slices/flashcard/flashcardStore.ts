import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FlashCard {
  id: string;
  term: string;
  definition: string;
  number: number;
  set_id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface FlashcardStore {
  setId: string | null;
  index: number;
  front: "term" | "definition";
  shuffledCards: FlashCard[];

  init: (setId: string, cards: FlashCard[]) => void;
  setIndex: (index: number) => void;
  goForward: () => void;
  goBack: () => void;
  toggleFront: () => void;
  setShuffle: (cards: FlashCard[]) => void;
  resetShuffle: (originalCards: FlashCard[]) => void;
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      setId: null,
      index: 0,
      front: "term",
      shuffledCards: [],

      // Called when entering the flashcard page for a set.
      // Resets index only if it's a different set than last time.
      init: (setId, cards) => {
        const current = get();
        if (current.setId === setId) {
          // Same set — keep index and order, but sync any card content changes
          const updatedCards = current.shuffledCards.map((sc) => {
            const fresh = cards.find((c) => c.id === sc.id);
            return fresh ?? sc;
          });
          set({ shuffledCards: updatedCards });
        } else {
          set({ setId, index: 0, shuffledCards: cards });
        }
      },

      setIndex: (index) => set({ index }),

      goForward: () =>
        set((s) => ({
          index: s.index + 1 >= s.shuffledCards.length ? 0 : s.index + 1,
        })),

      goBack: () =>
        set((s) => ({
          index: s.index - 1 < 0 ? s.shuffledCards.length - 1 : s.index - 1,
        })),

      toggleFront: () =>
        set((s) => ({ front: s.front === "term" ? "definition" : "term" })),

      setShuffle: (cards) => set({ shuffledCards: cards, index: 0 }),

      resetShuffle: (originalCards) =>
        set({ shuffledCards: originalCards, index: 0 }),
    }),
    {
      name: "studo-flashcard",
      partialize: (s) => ({
        setId: s.setId,
        index: s.index,
        front: s.front,
        shuffledCards: s.shuffledCards,
      }),
    },
  ),
);
