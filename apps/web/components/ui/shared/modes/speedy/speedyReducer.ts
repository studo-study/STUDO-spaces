import { Card } from "@/types/types";

export type Phase =
  | "answering"
  | "correct"
  | "incorrect"
  | "showAnswer"
  | "showProgress";

export interface State {
  index: number;
  queue: Card[];
  queueIndex: number;
  queueMode: boolean;
  phase: Phase;
  termMode: boolean;
  progressMode: boolean;
  correctCounts: Record<string, number>;
}

export type Action =
  | {
      type: "SUBMIT_ANSWER";
      input: string;
      correctAnswer: string;
      card: Card;
      cards: Card[];
    }
  | { type: "SHOW_ANSWER" }
  | { type: "ADVANCE"; cards: Card[] }
  | { type: "TOGGLE_TERM_MODE" }
  | { type: "TOGGLE_PROGRESS" };

export default function learnReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT_ANSWER": {
      const isCorrect = action.input === action.correctAnswer;
      const newCounts = { ...state.correctCounts };
      const current = newCounts[action.card.id] ?? 0;

      if (isCorrect) {
        newCounts[action.card.id] = Math.min(current + 1, 2);
      } else if (current >= 2) {
        newCounts[action.card.id] = 1;
      }
      // wrong at 0 or 1: count stays the same

      const allMastered =
        isCorrect &&
        action.cards.every((card) => (newCounts[card.id] ?? 0) >= 2);

      if (allMastered) {
        return {
          ...state,
          correctCounts: newCounts,
          phase: "showProgress",
          progressMode: true,
        };
      }

      return {
        ...state,
        phase: isCorrect ? "correct" : "incorrect",
        queue: isCorrect ? state.queue : [...state.queue, action.card],
        correctCounts: newCounts,
      };
    }

    case "SHOW_ANSWER":
      return { ...state, phase: "showAnswer" };

    case "ADVANCE": {
      console.log("ADVANCE from index:", state.index);
      console.log("cards length:", action.cards.length);
      console.log("correctCounts:", state.correctCounts);

      const allMastered = action.cards.every(
        (card) => (state.correctCounts[card.id] || 0) >= 2,
      );
      console.log("allMastered:", allMastered);

      if (allMastered) {
        return { ...state, phase: "showProgress", progressMode: true };
      }

      let idx = (state.index + 1) % action.cards.length;
      console.log("next idx:", idx, "card:", action.cards[idx]?.id);

      let attempts = 0;
      while ((state.correctCounts[action.cards[idx]?.id] || 0) >= 2) {
        idx = (idx + 1) % action.cards.length;
        attempts++;
        if (attempts >= action.cards.length) {
          return { ...state, phase: "showProgress", progressMode: true };
        }
      }

      console.log("final idx:", idx);
      return { ...state, index: idx, phase: "answering" };
    }

    case "TOGGLE_TERM_MODE":
      return { ...state, termMode: !state.termMode };

    case "TOGGLE_PROGRESS":
      return { ...state, progressMode: !state.progressMode };

    default:
      return state;
  }
}
