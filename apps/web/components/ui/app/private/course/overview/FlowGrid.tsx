"use client";
import { useFlowStore } from "@/store/slices/flow/flowStore";
import FlowGridItem from "@/components/ui/app/private/course/overview/FlowGridItem";

export default function FlowGrid() {
  const boards = useFlowStore((s) => s.boards);

  return (
    <div className="grid grid-cols-3 gap-4 pt-15">
      {boards.map((board) => (
        <FlowGridItem key={board.id} item={board} />
      ))}
    </div>
  );
}
