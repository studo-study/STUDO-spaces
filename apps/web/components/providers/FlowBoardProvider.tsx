
"use client";

import FlowBoardContext from "@/components/context/FlowBoardContext";
import { ReactNode, useCallback, useState } from "react";
import data from "@/data";
import {FlowBoardResponse} from "@studo/types";

export default function FlowBoardProvider({ children, data }: { children: ReactNode, data: FlowBoardResponse }) {
    const [open, setOpen] = useState(false);
    const toggleFlowBoard = useCallback(() => setOpen((prev) => !prev), []);

    return (
        <FlowBoardContext.Provider value={{ toggleFlowBoard, open, boardData: data }}>
    {children}
    </FlowBoardContext.Provider>
);
}