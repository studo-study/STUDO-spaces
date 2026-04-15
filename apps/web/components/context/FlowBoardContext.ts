"use client";

import { createContext, useContext } from "react";
import {FlowBoardResponse} from "@studo/types";

type FlowBoardContextProps = {
    toggleFlowBoard: () => void;
    open: boolean;
    boardData: FlowBoardResponse | null;
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
