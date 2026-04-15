"use client"
import {createContext, useContext} from "react";
import {FlowRowResponse, FullFlowCourseResponse} from "@studo/types";

interface CourseState {
    rows: FlowRowResponse[];
    setRows: React.Dispatch<React.SetStateAction<FlowRowResponse[]>>;
    updateRow: (index: number, updates: Partial<FlowRowResponse>) => Promise<void>;
    addRow: () => void;
    data: FullFlowCourseResponse;
}

export const CourseContext = createContext<CourseState | null>(null);

export const useCourseState = () => {
    const ctx = useContext(CourseContext);
    if (!ctx) throw new Error("useCourseState must be used inside provider");
    return ctx;
};