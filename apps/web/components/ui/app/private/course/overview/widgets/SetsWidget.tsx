import type { ReactNode } from "react";

export default function SetsWidget({
  icon,
  type,
}: {
  icon: ReactNode;
  type: string;
}) {
  return (
    <div
      className={
        "flex h-full w-full flex-col items-center gap-2 text-sm text-neutral-400"
      }
    >
      <div className={"w-full flex flex-row gap-2 items-center"}>
        {icon}
        <span className={"font-semibold capitalize"}>{type}</span>
      </div>
      <div className={"flex-1 min-h-0"}></div>
    </div>
  );
}
