import { create } from "zustand";

export const POMODORO_DURATION = 1200000;

interface PomodoroStore {
  isRunning: boolean;
  elapsed: number; // ms accumulated while paused
  startedAt: number | null; // wall-clock ms when the current run started
  setId: string | null;
  setSetid: (input: string) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  getElapsed: () => number;
}

export const pomodoroStore = create<PomodoroStore>((set, get) => ({
  isRunning: false,
  elapsed: 0,
  startedAt: null,
  setId: null,
  setSetid: (input: string) => set({ setId: input }),
  getElapsed: () => {
    const { elapsed, startedAt, isRunning } = get();
    const live = isRunning && startedAt != null ? Date.now() - startedAt : 0;
    return Math.min(elapsed + live, POMODORO_DURATION);
  },
  start: () => set({ isRunning: true, startedAt: Date.now() }),
  pause: () =>
    set({ isRunning: false, startedAt: null, elapsed: get().getElapsed() }),
  reset: () => set({ isRunning: false, startedAt: null, elapsed: 0 }),
}));
