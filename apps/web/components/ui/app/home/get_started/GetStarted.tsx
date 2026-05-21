"use client";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useSets } from "@/hooks/app/sets/useSets";
import { useBoards } from "@/hooks/app/flow/useBoards";

const GetStarted = () => {
  const { sets, isLoading: setsLoading } = useSets();
  const { data, isLoading: boardsLoading } = useBoards();
  const t = useTranslations("home");

  if (setsLoading || boardsLoading) return null;
  if (sets.length > 0 || (data?.boards ?? []).length > 0) return null;

  return (
    <section className="flex flex-col gap-5 overflow-visible">
      <SectionHeader
        sectionIcon={<FaPlus />}
        title={t("getstarted_overview_title")}
      />
      <Container height={"fit"}>
        <div className={"grid grid-cols-2 gap-5"}>
          <Link
            href={"/create-studoset"}
            className={"min-w-full h-full flex items-center justify-center"}
          >
            <BaseButton
              rounded={"xl"}
              label={t("studoset_btn_lbl")}
              width={"100%"}
              bg={"bg-emerald-400"}
              iconLeft={
                <Image
                  src={"/icons/studyset.svg"}
                  alt={"icon"}
                  width={0}
                  height={0}
                  className={"w-5 dark:invert dark:brightness-0"}
                />
              }
            />
          </Link>

          <Link
            href={"/create-visualset"}
            className={"min-w-full h-full flex items-center justify-center"}
          >
            <BaseButton
              rounded={"xl"}
              label={t("visualset_btn_lbl")}
              width={"100%"}
              bg={"bg-studoblue"}
              iconLeft={
                <Image
                  src={"/icons/visualset.svg"}
                  alt={"icon"}
                  width={0}
                  height={0}
                  className={"w-5 dark:invert dark:brightness-0"}
                />
              }
            />
          </Link>
        </div>
      </Container>
    </section>
  );
};

GetStarted.displayName = "GetStarted";
export default GetStarted;
