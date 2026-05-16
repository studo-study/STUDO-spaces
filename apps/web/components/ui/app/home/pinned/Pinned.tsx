import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import { useTranslations } from "next-intl";
import { IoPinSharp } from "react-icons/io5";

const Pinned = () => {
  const t = useTranslations("home");
  return (
    <section className={"gap-5 flex flex-col overflow-visible"}>
      <SectionHeader sectionIcon={<IoPinSharp />} title={t("pinned_title")} />
      <div className="relative w-full h-70 flex flex-row gap-2 overflow-visible">
        <Container width={"min-w-full"}>
          <div className={"w-full grid grid-cols-2"}></div>
        </Container>
      </div>
    </section>
  );
};

Pinned.displayName = "Pinned";
export default Pinned;
