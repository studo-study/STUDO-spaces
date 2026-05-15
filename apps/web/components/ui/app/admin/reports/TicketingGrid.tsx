"use client";
import { FaPlus } from "react-icons/fa";
import { useCallback, useRef, useState } from "react";
import { RiProgress4Line, RiProgress8Line } from "react-icons/ri";
import { MdOutlineBrightness1 } from "react-icons/md";
import TicketSearch from "@/components/ui/app/admin/reports/TicketSearch";
import { IoFilter } from "react-icons/io5";
import ReportColumn from "@/components/ui/app/admin/reports/ReportColumn";
import mockReports from "@/data/mocks/reportMock";
import { Issue } from "@/types/types";

const data: Issue[] = mockReports;

export default function TicketingGrid() {
  //refs
  const itemContainerRef = useRef<HTMLDivElement>(null);

  // Eén state voor de items per status
  const [columns, setColumns] = useState<Record<string, Issue[]>>({
    to_do: data.filter((item) => item.status === "to_do"),
    in_progress: data.filter((item) => item.status === "in_progress"),
    done: data.filter((item) => item.status === "done"),
  });

  // Metadata apart — dit verandert niet, dus geen state nodig
  const columnMeta: Record<
    string,
    { title: string; icon: React.ReactNode; description: string }
  > = {
    to_do: {
      title: "To Do",
      icon: <MdOutlineBrightness1 size={14} className="text-rose-500" />,
      description: "This task hasn't been started.",
    },
    in_progress: {
      title: "In Progress",
      icon: <RiProgress4Line className="text-amber-400" />,
      description: "This task actively being worked on.",
    },
    done: {
      title: "Done",
      icon: <RiProgress8Line className="text-emerald-400" />,
      description: "This task has been completed.",
    },
  };

  //use effects
  const handleMove = useCallback(
    (
      itemId: string,
      fromStatus: string,
      toStatus: string,
      newIndex: number,
    ) => {
      setColumns((prev) => {
        const updated = { ...prev };

        // 1. Vind en verwijder het item uit de bron-kolom
        const fromItems = [...updated[fromStatus]];
        const itemIndex = fromItems.findIndex((i) => i.report_id === itemId);
        const [movedItem] = fromItems.splice(itemIndex, 1);

        // 2. Update status op het item zelf
        const updatedItem = { ...movedItem, status: toStatus };

        // 3. Voeg toe op de juiste positie in de doel-kolom
        if (fromStatus === toStatus) {
          fromItems.splice(newIndex, 0, updatedItem);
          updated[fromStatus] = fromItems;
        } else {
          updated[fromStatus] = fromItems;
          const toItems = [...updated[toStatus]];
          toItems.splice(newIndex, 0, updatedItem);
          updated[toStatus] = toItems;
        }

        return updated;
      });
    },
    [],
  );

  const columnOrder = ["to_do", "in_progress", "done"];

  return (
    <div
      className={
        "w-full h-full flex flex-col gap-5 dark:text-white text-studodarkblue"
      }
    >
      <div
        className={"w-full h-fit flex flex-row items-center justify-between"}
      >
        <TicketSearch />
        <div
          className={
            "w-fit h-fit  flex flex-row items-center justify-between gap-3 text-sm font-bold"
          }
        >
          <span
            className={
              "w-fit px-3 py-1 cursor-pointer rounded-full border border-studoborder/30 bg-studogrey/30"
            }
          >
            My Issues
          </span>
          <div
            className={
              "p-2 cursor-pointer rounded-full border border-studoborder/30 bg-studogrey/30"
            }
          >
            <IoFilter size={12} />
          </div>
          <div
            className={
              "p-2 cursor-pointer rounded-full border border-studoborder/30 bg-studogrey/30"
            }
          >
            <FaPlus size={12} />
          </div>
        </div>
      </div>
      <div
        ref={itemContainerRef}
        className="w-full h-full grid grid-cols-3 gap-7"
      >
        {columnOrder.map((status) => {
          const meta = columnMeta[status];
          const items = columns[status];
          return (
            <ReportColumn
              key={status}
              title={meta.title}
              icon={meta.icon}
              count={items.length}
              description={meta.description}
              items={items}
              status={status}
              onMove={handleMove}
            />
          );
        })}
      </div>
    </div>
  );
}
