import { create } from "zustand";

// Flow data now lives in react-query (see hooks/app/flow/*). This store only
// holds ephemeral UI state that never needs to be fetched or persisted.
interface FlowUIState {
  createCourseOpen: boolean;
  courseView: "overview" | "cursus" | "flow" | "sets";

  toggleCreateCourse: () => void;
  setCreateCourseOpen: (open: boolean) => void;
  setCourseView: (view: "overview" | "cursus" | "flow" | "sets") => void;
}

export const useFlowStore = create<FlowUIState>((set) => ({
  createCourseOpen: false,
  courseView: "overview",

  toggleCreateCourse: () =>
    set((s) => ({ createCourseOpen: !s.createCourseOpen })),

  setCreateCourseOpen: (open) => set({ createCourseOpen: open }),

  setCourseView: (view) => set({ courseView: view }),
}));
