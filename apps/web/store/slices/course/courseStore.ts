import { create } from "zustand";

// Course-data leeft in react-query (zie hooks/app/courses/*). Deze store houdt
// enkel efemere UI-state die nooit gefetcht of gepersisteerd hoeft te worden.
interface CourseUIState {
  createCourseOpen: boolean;
  courseView: "overview" | "cursus" | "flow" | "sets";

  toggleCreateCourse: () => void;
  setCreateCourseOpen: (open: boolean) => void;
  setCourseView: (view: "overview" | "cursus" | "flow" | "sets") => void;
}

export const useCourseStore = create<CourseUIState>((set) => ({
  createCourseOpen: false,
  courseView: "overview",

  toggleCreateCourse: () =>
    set((s) => ({ createCourseOpen: !s.createCourseOpen })),

  setCreateCourseOpen: (open) => set({ createCourseOpen: open }),

  setCourseView: (view) => set({ courseView: view }),
}));
