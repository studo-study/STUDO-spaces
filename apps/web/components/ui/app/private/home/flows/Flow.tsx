"use client";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import { useTranslations } from "next-intl";
import { FaRegClipboard } from "react-icons/fa";
import FlowItem from "@/components/ui/app/private/home/flows/FlowItem";
import { useBoards } from "@/hooks/app/courses/useBoards";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";

const Flow = () => {
  const { data, isLoading } = useBoards();
  const t = useTranslations("home");

  const boards = data?.boards ?? [];

  if (isLoading || boards.length === 0) return null;

  return (
    <AnimateOnMount delay={300}>
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
    </AnimateOnMount>
  );
};

Flow.displayName = "Flow";
export default Flow;
