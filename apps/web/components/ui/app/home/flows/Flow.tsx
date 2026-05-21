"use client";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import { useTranslations } from "next-intl";
import { FaRegClipboard } from "react-icons/fa";
import FlowItem from "@/components/ui/app/home/flows/FlowItem";
import { useBoards } from "@/hooks/app/useBoards";

const Flow = () => {
  const { data, isLoading } = useBoards();
  const t = useTranslations("home");

  const boards = data?.boards ?? [];

  if (isLoading || boards.length === 0) return null;

  return (
    <section className="flex flex-col gap-5 overflow-visible">
      <SectionHeader
        sectionIcon={<FaRegClipboard />}
        title={t("flow_overview_title")}
        linkText={t("all_boards")}
        href={"/flow"}
      />
      <Container height={"30"}>
        <div className="min-w-full w-full flex flex-row gap-5">
          {boards.map((item, index) => (
            <FlowItem key={index} board={item} />
          ))}
        </div>
      </Container>
    </section>
  );
};

Flow.displayName = "Flow";
export default Flow;
