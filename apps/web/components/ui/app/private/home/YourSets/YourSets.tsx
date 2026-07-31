"use client";
import Container from "@/components/ui/design_system/container/Container";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import { useTranslations } from "next-intl";
import { BsCollection } from "react-icons/bs";
import { LastStudied } from "@studo/types";
import HomePageSetItem from "@/components/ui/app/private/home/YourSets/SetItem";
import { useSets } from "@/hooks/app/sets/useSets";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";

const YourSets = () => {
  const { lastTen } = useSets();
  const t = useTranslations("home");

  const items: LastStudied[] = lastTen.slice(0, 6);

  if (items.length === 0) return null;

  return (
    <AnimateOnMount delay={100}>
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
    </AnimateOnMount>
  );
};

YourSets.displayName = "YourSets";
export default YourSets;
