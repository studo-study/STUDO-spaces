"use client";
import { useSideMenu } from "@/store/course_context_menu/SideMenuStore";
import PdfReader from "./PdfReader";
import { useTranslations } from "next-intl";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { Link } from "lucide-react";
import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";

const CourseOverview = () => {
  const t = useTranslations("flow.course");
  const info = useSideMenu((state) => state.menuInfo);
  if (info.course_id) {
    return <PdfReader />;
  }
  return (
    <div className={"flex min-w-0 min-h-0 flex-1 flex-col"}>
      <ContextMenuHeader />
      <div
        className={
          "min-w-0 min-h-0 flex-1 flex flex-col items-center dark:text-white text-studodarkblue justify-center gap-3"
        }
      >
        <span>{t("not_in_course_yet")}</span>
        <div className={"max-h-fit"}>
          <BaseButton
            iconLeft={<Link size={15} />}
            variant={"submit"}
            label={t("add_to_course")}
            className={"max-h-fit"}
          />
        </div>
      </div>
    </div>
  );
};

CourseOverview.displayName = "CourseOverview";
export default CourseOverview;
