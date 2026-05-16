"use client";
import { useTranslations } from "next-intl";
import TriggerFlow from "@/components/ui/app/flow/overview/TriggerFlow";
import { useState } from "react";
import CreateFlowBoard from "@/components/ui/app/flow/overview/CreateFlowBoard";

const FlowHeader = () => {
  const t = useTranslations("flow");
  const [flowIsOpen, setFlowIsOpen] = useState(false);
  const togglePopUp = () => {
    setFlowIsOpen((prev) => !prev);
  };

  return (
    <div
      className={"min-w-full h-15 flex flex-col justify-between items-center "}
    >
      <div className={"w-full h-fit flex items-center justify-between"}>
        <span
          className={"w-full font-bold dark:text-white text-2xl font-georgia"}
        >
          {t("title")}
        </span>
        <TriggerFlow togglePopUp={togglePopUp} />
      </div>
      <div className={"w-full z-10 bottom-0 h-0.5 bg-studogrey"} />
      <CreateFlowBoard createOpen={flowIsOpen} setCreateOpen={setFlowIsOpen} />
    </div>
  );
};

FlowHeader.displayName = "FlowHeader";
export default FlowHeader;
