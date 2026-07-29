"use client";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { createStore, useStore, type StoreApi } from "zustand";

interface LearnSettings {
  pomodoro: boolean;
  setPomodoro: (input: boolean) => void;
  pomodoroCount: string;
  setPomodoroCount: (input: string) => void;
  twentyMode: boolean;
  setTwentyMode: (input: boolean) => void;
  twentyCount: string;
  setTwentyCount: (input: string) => void;
  answerWith: "term" | "definition" | string;
  setAnswerWith: (input: "term" | "definition") => void;
  answerType: "multiplechoice" | "typing" | "both" | string;
  setAnswerType: (input: "multiplechoice" | "typing" | "both") => void;
  revisionCount: number;
  setRevisionCount: (input: number) => void;
  strictnessLevel: number;
  setStrictnessLevel: (input: number) => void;
}

export const DEFAULT_LEARN_SETTINGS = {
  pomodoro: false,
  pomodoroCount: "",
  twentyMode: true,
  twentyCount: "",
  answerWith: "term",
  answerType: "both",
  revisionCount: 2,
  strictnessLevel: 5,
};
interface LearnStore {
  setId: string | null;
  index: number;
  setIndex: (input: number) => void;
  queueIndex: number;
  learnSettings: LearnSettings;
}

type LearnStoreApi = StoreApi<LearnStore>;

const createLearnStore = (setId: string | null): LearnStoreApi =>
  createStore<LearnStore>((set) => ({
    setId,
    index: 0,
    setIndex: (input) =>
      set((state) => ({
        ...state,
        index: input,
      })),
    queueIndex: 0,
    learnSettings: {
      setPomodoro: (input) =>
        set((state) => ({
          ...state,
          learnSettings: {
            ...state.learnSettings,
            pomodoro: input,
          },
        })),
      setPomodoroCount: (input) =>
        set((state) => ({
          ...state,
          learnSettings: { ...state.learnSettings, pomodoroCount: input },
        })),
      setTwentyMode: (input) =>
        set((state) => ({
          ...state,
          learnSettings: { ...state.learnSettings, twentyMode: input },
        })),
      setTwentyCount: (input) =>
        set((state) => ({
          ...state,
          learnSettings: { ...state.learnSettings, twentyCount: input },
        })),
      setAnswerWith: (input) =>
        set((state) => ({
          ...state,
          learnSettings: { ...state.learnSettings, answerWith: input },
        })),
      setAnswerType: (input) =>
        set((state) => ({
          ...state,
          learnSettings: { ...state.learnSettings, answerType: input },
        })),
      setRevisionCount: (input) =>
        set((state) => ({
          ...state,
          learnSettings: { ...state.learnSettings, revisionCount: input },
        })),
      setStrictnessLevel: (input) =>
        set((state) => ({
          ...state,
          learnSettings: { ...state.learnSettings, strictnessLevel: input },
        })),
      ...DEFAULT_LEARN_SETTINGS,
    },
  }));

// One store per setId. Reused across remounts/navigation so progress persists
// while switching between sets keeps each set isolated.
const stores = new Map<string, LearnStoreApi>();

const getLearnStore = (setId: string): LearnStoreApi => {
  let store = stores.get(setId);
  if (!store) {
    store = createLearnStore(setId);
    stores.set(setId, store);
  }
  return store;
};

let fallbackStore: LearnStoreApi | null = null;
const getFallbackStore = (): LearnStoreApi => {
  if (!fallbackStore) fallbackStore = createLearnStore(null);
  return fallbackStore;
};

// Points at the store of the set currently being learned. Lets consumers
// rendered outside LearnStoreProvider (global sidebar / LearnSettings) drive
// the same store the learn page reads, so settings changes apply live.
const activeStoreHolder = createStore<{ api: LearnStoreApi | null }>(() => ({
  api: null,
}));

const LearnStoreContext = createContext<LearnStoreApi | null>(null);

export const LearnStoreProvider = ({
  setId,
  children,
}: {
  setId: string;
  children: ReactNode;
}) => {
  const store = getLearnStore(setId);
  useEffect(() => {
    activeStoreHolder.setState({ api: store });
    return () => {
      // only clear if we're still the active set
      if (activeStoreHolder.getState().api === store) {
        activeStoreHolder.setState({ api: null });
      }
    };
  }, [store]);
  return createElement(LearnStoreContext.Provider, { value: store }, children);
};

export function useLearnStore<T>(selector: (state: LearnStore) => T): T {
  const contextStore = useContext(LearnStoreContext);
  const activeStore = useStore(activeStoreHolder, (s) => s.api);
  const store = contextStore ?? activeStore ?? getFallbackStore();
  return useStore(store, selector);
}
