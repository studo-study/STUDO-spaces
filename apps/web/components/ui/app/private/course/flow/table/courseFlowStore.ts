import { CourseRow } from "@studo/types";
import { create } from "zustand";

interface CourseFlowStore {
  rows: CourseRow[];
  addRow: (input: CourseRow, index: number) => void;
  removeRow: (input: string) => void;
  selectedIds: string[];
  toggeSelectRow: (input: string) => void;
  toggleAll: (input: string[]) => void;
  clearSelected: () => void;
  removeSelected: () => void;
}

const useCourseFlowStore = create<CourseFlowStore>((set) => ({
  rows: [],
  addRow: (input, index) =>
    set((state) => ({
      rows: [...state.rows.slice(0, index), input, ...state.rows.slice(index)],
    })),
  removeRow: (input) =>
    set((state) => {
      return { rows: state.rows.filter((row) => row.id != input) };
    }),

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
  removeSelected: () =>
    set((state) =>
      state.selectedIds.length === 0
        ? state
        : {
            rows: state.rows.filter(
              (row) => !state.selectedIds.includes(row.id),
            ),
            selectedIds: [],
          },
    ),
}));

export default useCourseFlowStore;
