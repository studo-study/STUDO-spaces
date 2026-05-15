import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  id: string;
}
export default function Droppable({ id }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return <div ref={setNodeRef} style={style}></div>;
}
