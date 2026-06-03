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
  wrongAttempt: boolean;
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
  | { type: "TOGGLE_PROGRESS" }
  | { type: "RESET_WRONG_ATTEMPT" };

export default function learnReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT_ANSWER": {
      const isCorrect = action.input === action.correctAnswer;
      // Timer expiry dispatches with empty input; typed wrong answers have non-empty input
      const isTimerExpiry = !isCorrect && action.input === "";

      const newCounts = { ...state.correctCounts };
      const current = newCounts[action.card.id] ?? 0;

      if (isCorrect) {
        newCounts[action.card.id] = Math.min(current + 1, 2);
      } else if (isTimerExpiry && current >= 2) {
        newCounts[action.card.id] = 1;
      }

      const allMastered =
        isCorrect &&
        action.cards.every((card) => (newCounts[card.id] ?? 0) >= 2);

      if (allMastered) {
        return {
          ...state,
          correctCounts: newCounts,
          phase: "showProgress",
          progressMode: true,
          wrongAttempt: false,
        };
      }

      if (isCorrect) {
        return {
          ...state,
          phase: "correct",
          correctCounts: newCounts,
          wrongAttempt: false,
        };
      }

      if (isTimerExpiry) {
        // Timer ran out: add to queue and advance
        return {
          ...state,
          phase: "incorrect",
          queue: [...state.queue, action.card],
          correctCounts: newCounts,
          wrongAttempt: false,
        };
      }

      // Typed wrong answer: stay on same card, let user retry
      return {
        ...state,
        phase: "answering",
        wrongAttempt: true,
      };
    }

    case "SHOW_ANSWER":
      return { ...state, phase: "showAnswer" };

    case "ADVANCE": {
      const allMastered = action.cards.every(
        (card) => (state.correctCounts[card.id] || 0) >= 2,
      );

      if (allMastered) {
        return { ...state, phase: "showProgress", progressMode: true };
      }

      let idx = (state.index + 1) % action.cards.length;

      let attempts = 0;
      while ((state.correctCounts[action.cards[idx]?.id] || 0) >= 2) {
        idx = (idx + 1) % action.cards.length;
        attempts++;
        if (attempts >= action.cards.length) {
          return { ...state, phase: "showProgress", progressMode: true };
        }
      }
      return { ...state, index: idx, phase: "answering", wrongAttempt: false };
    }

    case "TOGGLE_TERM_MODE":
      return { ...state, termMode: !state.termMode };

    case "TOGGLE_PROGRESS":
      return { ...state, progressMode: !state.progressMode };

    case "RESET_WRONG_ATTEMPT":
      return { ...state, wrongAttempt: false };

    default:
      return state;
  }
}
