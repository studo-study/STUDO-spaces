"use client";
import Container from "@/components/ui/design_system/container/Container";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import { useTranslations } from "next-intl";
import { BsCollection } from "react-icons/bs";
import { LastStudied } from "@studo/types";
import HomePageSetItem from "@/components/ui/app/home/YourSets/SetItem";
import { useSets } from "@/hooks/app/useSets";

const YourSets = () => {
  const { sets, visualsets } = useSets();
  const t = useTranslations("home");

  const items: LastStudied[] = [
    ...sets
      .filter((s) => s.last_studied)
      .map((s) => ({
        set_id: s.id,
        last_studied: s.last_studied!,
        title: s.title,
        Course: s.course,
        type: "studyset" as const,
        progress: s.progress ?? 0,
        length: s.card_count ?? 0,
      })),
    ...visualsets
      .filter((vs) => vs.last_studied)
      .map((vs) => ({
        set_id: vs.id,
        last_studied: vs.last_studied!,
        title: vs.title,
        Course: vs.course,
        type: "visualset" as const,
        progress: vs.progress ?? 0,
        length: vs.pin_count ?? 0,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.last_studied).getTime() - new Date(a.last_studied).getTime(),
    )
    .slice(0, 10);

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-5 overflow-visible">
      <SectionHeader
        sectionIcon={<BsCollection />}
        title={t("set_overview_title")}
        linkText={t("all_sets")}
        href={"/your-files/sets"}
      />
      <Container>
        <div className={"w-full grid grid-cols-2 gap-5"}>
          {items.map((item, index) => (
            <HomePageSetItem key={index} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
};

YourSets.displayName = "YourSets";
export default YourSets;
