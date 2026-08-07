import { create } from "zustand";
import { ReactNode } from "react";

export interface IFlowRow {
  title?: ReactNode;
  href: string;
  isLast: boolean;
  translate?: boolean;
}

export interface IFlowTable {
  rows: IFlowRow[];
}

export interface IFlowBoardStore {
  id: string;
  courseId: string;
  title: string;
  description: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  table: IFlowTable | null;
}

export const useCourseNavStore = create<IFlowBoardStore>((set) => ({
  id: "",
  setId: (input: string) => set({ id: input }),
  courseId: "",
  title: "",
  description: "",
  createdAt: null,
  updatedAt: null,
  table: null,
}));
