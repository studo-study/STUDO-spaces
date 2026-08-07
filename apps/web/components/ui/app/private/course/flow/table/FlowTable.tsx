"use client";
import { SegmentedControls } from "@/components/ui/design_system/segmentedcontrols/SegmentedControls";
import { useState } from "react";
import { List, Table } from "lucide-react";
import TableControls from "@/components/ui/app/private/course/flow/table/TableControls";
import TableDisplay from "@/components/ui/app/private/course/flow/table/TableDisplay";

const TableDisplayTabs = [
  {
    key: "table",
    label: "",
    icon: <Table size={15} />,
  },
  {
    key: "list",
    label: "",
    icon: <List size={15} />,
  },
];

const FlowTable = () => {
  const [tab, setTab] = useState("table");

  return (
    <div className={"flex flex-col gap-10"}>
      <div className={"w-full h-fit flex justify-between items-center"}>
        <SegmentedControls
          size={"sm"}
          tabs={TableDisplayTabs}
          value={tab}
          onChange={setTab}
        />
        <TableControls />
      </div>
      {tab === "table" && <TableDisplay />}
    </div>
  );
};

FlowTable.displayName = "FlowTable";
export default FlowTable;
