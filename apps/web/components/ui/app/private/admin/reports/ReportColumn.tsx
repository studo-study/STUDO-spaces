// ReportColumn.tsx
import { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import GridHeader from "@/components/ui/app/private/admin/reports/GridHeader";
import IssueItem from "@/components/ui/app/private/admin/reports/Issue";
import { Issue } from "@/types/types";

interface ReportColumnProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  description: string;
  items: Issue[];
  status: string;
  onMove: (
    itemId: string,
    fromStatus: string,
    toStatus: string,
    newIndex: number,
  ) => void;
}

export default function ReportColumn({
  title,
  icon,
  count,
  description,
  items,
  status,
  onMove,
}: ReportColumnProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;

    const sortable = new Sortable(listRef.current, {
      group: "tickets",
      animation: 200,
      handle: ".handle",

      onEnd: (evt) => {
        const itemId = evt.item.dataset.id;
        const fromStatus = evt.from.dataset.status!;
        const toStatus = evt.to.dataset.status!;
        const newIndex = evt.newIndex!;
        if (!itemId) return;

        if (evt.from !== evt.to) {
          evt.from.insertBefore(
            evt.item,
            evt.from.children[evt.oldIndex!] || null,
          );
        } else {
          const ref = evt.from.children[evt.oldIndex!] || null;
          evt.from.insertBefore(evt.item, ref);
        }

        onMove(itemId, fromStatus, toStatus, newIndex);
      },
    });

    return () => sortable.destroy();
  }, [status, onMove]);

  return (
    <div className="w-full max-h-165 min-h-165 flex flex-col gap-5 border border-studoborder/30 bg-studogrey/10 rounded-3xl p-5">
      <GridHeader
        title={title}
        icon={icon}
        count={count}
        description={description}
      />
      <div
        ref={listRef}
        data-status={status}
        className="max-w-full h-full rounded-2xl group overflow-y-scroll overflow-hidden scroll-hidden flex flex-col gap-3"
      >
        {items.map((item) => (
          <div key={item.reportId} data-id={item.reportId}>
            <IssueItem item={item} status={status} />
          </div>
        ))}
      </div>
    </div>
  );
}
