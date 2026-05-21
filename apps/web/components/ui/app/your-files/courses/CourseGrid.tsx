"use client";
import Image from "next/image";
import CourseItem from "@/components/ui/app/your-files/courses/courseItem";
import { useSets } from "@/hooks/app/sets/useSets";
import { useTranslations } from "next-intl";

const CourseGrid = () => {
  const t = useTranslations("courses");
  const { sets, visualsets } = useSets();
  const courses = new Set<string>();
  sets?.forEach((item: { course: string }) => courses.add(item.course));
  visualsets?.forEach((item: { course: string }) => courses.add(item.course));

  if ([...courses].length === 0) {
    return (
      <div className="w-full h-fit flex-1 flex-col gap-2 flex dark:text-white text-studodarkblue font-bold items-center pt-40">
        <Image
          width={100}
          height={100}
          src={"/images/fallbacks/graduate.png"}
          alt=""
          className="h-30 w-30 opacity-50 saturate-0"
        />
        <div className={"flex flex-col items-center justify-center gap-2"}>
          <span className={"dark:text-white text-xl font-bold"}>
            {t("nothing_title")}
          </span>
          <p
            className={"dark:text-studogrey text-gray-400 font-normal text-sm"}
          >
            {t("nothing_paragraph")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-5 gap-5 scroll-hidden py-5">
      {[...courses].map((item) => (
        <CourseItem key={item} course={item} options />
      ))}
    </div>
  );
};

CourseGrid.displayName = "CourseGrid";
export default CourseGrid;
