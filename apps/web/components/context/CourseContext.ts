"use client";
import { createContext, useContext } from "react";
import { CourseRow, FullCourseResponse } from "@studo/types";

interface CourseState {
  rows: CourseRow[];
  setRows: React.Dispatch<React.SetStateAction<CourseRow[]>>;
  updateRow: (index: number, updates: Partial<CourseRow>) => Promise<void>;
  addRow: () => void;
  data: FullCourseResponse;
}

export const CourseContext = createContext<CourseState | null>(null);

export const useCourseState = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourseState must be used inside provider");
  return ctx;
};
