import { create } from "zustand";

export const POMODORO_DURATION = 1200000;

interface PomodoroStore {
  isRunning: boolean;
  elapsed: number; // ms accumulated while paused
  startedAt: number | null; // wall-clock ms when the current run started
  finished: boolean; // timer reached POMODORO_DURATION (blijft staan tot ack)
  setId: string | null;
  setSetid: (input: string) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  finish: () => void;
  getElapsed: () => number;
}

export const pomodoroStore = create<PomodoroStore>((set, get) => ({
  isRunning: false,
  elapsed: 0,
  startedAt: null,
  finished: false,
  setId: null,
  setSetid: (input: string) => set({ setId: input }),
  getElapsed: () => {
    const { elapsed, startedAt, isRunning } = get();
    const live = isRunning && startedAt != null ? Date.now() - startedAt : 0;
    return Math.min(elapsed + live, POMODORO_DURATION);
  },
  start: () => set({ isRunning: true, startedAt: Date.now(), finished: false }),
  pause: () =>
    set({ isRunning: false, startedAt: null, elapsed: get().getElapsed() }),
  reset: () =>
    set({ isRunning: false, startedAt: null, elapsed: 0, finished: false }),
  // timer afgelopen: stop de run maar markeer als finished (button bounce)
  finish: () =>
    set({ isRunning: false, startedAt: null, elapsed: 0, finished: true }),
}));
