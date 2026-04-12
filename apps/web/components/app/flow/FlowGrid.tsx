"use client"
import { useFlowStore } from "@/store/flowStore";
import { useEffect, useState } from "react";
import { FlowBoardOverview } from "@studo/types";
import FlowGridItem from "@/components/app/flow/FlowGridItem";

interface FlowGridProps {
    initialBoards: FlowBoardOverview[];
}

export default function FlowGrid({ initialBoards }: FlowGridProps) {
    const { boards, setBoards } = useFlowStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        if (initialBoards.length > 0) {
            setBoards(initialBoards);
        }
        setHydrated(true);
    }, [initialBoards, setBoards]);

    const displayBoards = hydrated ? boards : initialBoards;

    return (
        <div className="grid grid-cols-3 gap-4 pt-15">
            {displayBoards.map((board) => (
                <FlowGridItem key={board.id} item={board} />
            ))}
        </div>
    );
}