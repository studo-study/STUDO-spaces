"use client";
import { useFlowBoards } from "@/hooks/app/flow/useFlowData";
import FlowGridItem from "@/components/ui/app/private/board/FlowGridItem";

export default function FlowGrid() {
  const boards = useFlowBoards().data ?? [];

  return (
    <div className="grid grid-cols-3 gap-4 pt-15">
      {boards.map((board) => (
        <FlowGridItem key={board.id} item={board} />
      ))}
    </div>
  );
}
