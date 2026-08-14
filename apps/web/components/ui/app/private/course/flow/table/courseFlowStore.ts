import { create } from "zustand";

/**
 * Enkel efemere UI-selectie. De rij-data zelf leeft in de react-query
 * course-cache (zie useCourseFlow) zodat alles persistent is.
 */
interface CourseFlowStore {
  selectedIds: string[];
  toggeSelectRow: (input: string) => void;
  toggleAll: (input: string[]) => void;
  clearSelected: () => void;
}

const useCourseFlowStore = create<CourseFlowStore>((set) => ({
  selectedIds: [],
  toggeSelectRow: (input) =>
    set((state) => {
      if (state.selectedIds.includes(input)) {
        return { selectedIds: state.selectedIds.filter((id) => id != input) };
      }
      return { selectedIds: [...state.selectedIds, input] };
    }),
  toggleAll: (input) =>
    // Iets geselecteerd -> alles leeg; niets geselecteerd -> alles selecteren.
    set((state) =>
      state.selectedIds.length > 0
        ? { selectedIds: [] }
        : { selectedIds: input },
    ),
  clearSelected: () =>
    set((state) =>
      state.selectedIds.length === 0 ? state : { selectedIds: [] },
    ),
}));

export default useCourseFlowStore;
