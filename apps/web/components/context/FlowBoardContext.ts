"use client";

import { createContext, useContext } from "react";

type FlowBoardContextProps = {
    toggleFlowBoard: () => void;
    open: boolean;
};

const FlowBoardContext = createContext<FlowBoardContextProps | null>(null);

export function useFlowBoard() {
    const ctx = useContext(FlowBoardContext);
    if (!ctx) {
        throw new Error("useAppLayout must be used inside AppLayoutProvider");
    }
    return ctx;
}

export default FlowBoardContext;
