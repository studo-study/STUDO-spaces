
"use client";

import FlowBoardContext from "@/components/context/FlowBoardContext";
import { ReactNode, useCallback, useState } from "react";

export default function FlowBoardProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const toggleFlowBoard = useCallback(() => setOpen((prev) => !prev), []);

    return (
        <FlowBoardContext.Provider value={{ toggleFlowBoard, open }}>
    {children}
    </FlowBoardContext.Provider>
);
}