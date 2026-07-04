import { create } from "zustand";

interface LearnSettings {
  pomodoro: boolean;
  setPomodoro: (input: boolean) => void;
  pomodoroCount: string;
  setPomodoroCount: (input: string) => void;
  twentyMode: boolean;
  setTwentyMode: (input: boolean) => void;
  twentyCount: string;
  setTwentyCount: (input: string) => void;
  answerWith: "term" | "definition";
  setAnswerWith: (input: "term" | "definition") => void;
  answerType: "multiplechoice" | "typing" | "both";
  setAnswerType: (input: "multiplechoice" | "typing" | "both") => void;
  revisionCount: number;
  setRevisionCount: (input: number) => void;
  strictnessLevel: number;
  setStrictnessLevel: (input: number) => void;
}
interface LearnStore {
  setId: string | null;
  setSetId: (input: string) => void;
  index: number;
  setIndex: (input: number) => void;
  queueIndex: number;
  learnSettings: LearnSettings;
}
export const useLearnStore = create<LearnStore>((set) => ({
  setId: null,
  setSetId: (input) =>
    set({
      setId: input,
    }),
  index: 0,
  setIndex: (input) =>
    set((state) => ({
      ...state,
      index: input,
    })),
  queueIndex: 0,
  learnSettings: {
    pomodoro: false,
    setPomodoro: (input) =>
      set((state) => ({
        ...state,
        learnSettings: {
          ...state.learnSettings,
          pomodoro: input,
        },
      })),
    pomodoroCount: "",
    setPomodoroCount: (input) =>
      set((state) => ({
        ...state,
        learnSettings: { ...state.learnSettings, pomodoroCount: input },
      })),
    twentyMode: true,
    setTwentyMode: (input) =>
      set((state) => ({
        ...state,
        learnSettings: { ...state.learnSettings, twentyMode: input },
      })),
    twentyCount: "",
    setTwentyCount: (input) =>
      set((state) => ({
        ...state,
        learnSettings: { ...state.learnSettings, twentyCount: input },
      })),
    answerWith: "term",
    setAnswerWith: (input) =>
      set((state) => ({
        ...state,
        learnSettings: { ...state.learnSettings, answerWith: input },
      })),
    answerType: "both",
    setAnswerType: (input) =>
      set((state) => ({
        ...state,
        learnSettings: { ...state.learnSettings, answerType: input },
      })),
    revisionCount: 2,
    setRevisionCount: (input) =>
      set((state) => ({
        ...state,
        learnSettings: { ...state.learnSettings, revisionCount: input },
      })),
    strictnessLevel: 5,
    setStrictnessLevel: (input) =>
      set((state) => ({
        ...state,
        learnSettings: { ...state.learnSettings, strictnessLevel: input },
      })),
  },
}));
