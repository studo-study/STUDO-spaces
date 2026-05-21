"use client";
import { useSets } from "@/hooks/app/useSets";
import { StudysetResponse, type VisualsetResponse } from "@studo/types";
import { StudySetItem } from "@/components/ui/app/your-files/sets/grid";
import Image from "next/image";
import ListItems from "@/components/ui/app/your-files/sets/listitems";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { FaChevronLeft } from "react-icons/fa";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

interface CourseSetsProps {
  id: string;
}
const CourseSets = (props: CourseSetsProps) => {
  const { id } = props;
  const course = id.replace("-", " ");
  console.log(course);
  const t = useTranslations("course");

  const { sets, visualsets } = useSets();
  const allSets: StudySetItem[] = [
    ...sets.map((s: StudysetResponse) => ({
      ...s,
      type: "studyset" as const,
    })),
    ...visualsets.map((s: VisualsetResponse) => ({
      ...s,
      type: "visualset" as const,
    })),
  ].filter((set) => set.course === course);

  const router = useRouter();
  return (
    <div className={"w-full flex-1 h-full flex flex-col gap-5"}>
      <div className={"w-full h-20 pt-5 flex flex-row gap-3 items-center"}>
        <BaseButton
          className={"px-0"}
          variant={"icon"}
          icon={<FaChevronLeft />}
          width={"fit"}
          onClick={() => router.push("/your-files/courses")}
        />
        <span className={"text-2xl font-bold"}>{course}</span>
      </div>
      <div className="w-full flex-1 h-fit gap-2 flex flex-col">
        {allSets.length === 0 ? (
          <div className="w-full h-fit flex-1 flex-col gap-2 flex dark:text-white text-studodarkblue font-bold items-center pt-40">
            <Image
              width={100}
              height={100}
              src={"/images/fallbacks/books.png"}
              alt=""
              className="h-30 w-30 opacity-50 saturate-0"
            />
            <div className={"flex flex-col items-center justify-center gap-2"}>
              <span className={"dark:text-white text-xl font-bold"}>
                {t("nothing_title")}
              </span>
              <p
                className={
                  "dark:text-studogrey text-gray-400 font-normal text-sm"
                }
              >
                {t("nothing_paragraph")}
              </p>
            </div>
          </div>
        ) : (
          <ListItems items={allSets} />
        )}
      </div>
    </div>
  );
};

CourseSets.displayName = "CourseSets";
export default CourseSets;
