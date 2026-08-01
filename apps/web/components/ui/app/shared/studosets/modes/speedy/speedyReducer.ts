import { Card } from "@/types/types";

export type Phase = "answering" | "correct" | "incorrect" | "finished";

export interface State {
  deck: Card[]; // cards in the current round
  deckIndex: number; // position in the current deck
  nextQueue: Card[]; // wrong cards, carried to the next round
  round: number; // 1-based round counter
  phase: Phase;
  termMode: boolean;
  totalAnswers: number;
  correctAnswers: number;
}

export type Action =
  | {
      type: "SUBMIT_ANSWER";
      input: string;
      correctAnswer: string;
      card: Card;
    }
  | { type: "ADVANCE" }
  | { type: "TOGGLE_TERM_MODE" }
  | { type: "RESET"; cards: Card[] };

export function makeInitialState(cards: Card[]): State {
  return {
    deck: cards,
    deckIndex: 0,
    nextQueue: [],
    round: 1,
    phase: cards.length === 0 ? "finished" : "answering",
    termMode: true,
    totalAnswers: 0,
    correctAnswers: 0,
  };
}

const normalize = (s: string) => s.trim().toLowerCase();

export default function speedyReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT_ANSWER": {
      const isCorrect =
        normalize(action.input) === normalize(action.correctAnswer);
      const totalAnswers = state.totalAnswers + 1;

      if (isCorrect) {
        // Correct once -> card is done, not carried to next round.
        return {
          ...state,
          phase: "correct",
          totalAnswers,
          correctAnswers: state.correctAnswers + 1,
        };
      }

      // Typed wrong OR timer expiry -> card returns in the next round.
      return {
        ...state,
        phase: "incorrect",
        totalAnswers,
        nextQueue: [...state.nextQueue, action.card],
      };
    }

    case "ADVANCE": {
      const nextIndex = state.deckIndex + 1;

      if (nextIndex < state.deck.length) {
        return { ...state, deckIndex: nextIndex, phase: "answering" };
      }

      // Reached the end of the current deck (round complete).
      if (state.nextQueue.length === 0) {
        return { ...state, phase: "finished" };
      }

      // Start the next round with the queued cards.
      return {
        ...state,
        deck: state.nextQueue,
        nextQueue: [],
        deckIndex: 0,
        round: state.round + 1,
        phase: "answering",
      };
    }

    case "TOGGLE_TERM_MODE":
      return { ...state, termMode: !state.termMode };

    case "RESET":
      return makeInitialState(action.cards);

    default:
      return state;
  }
}
