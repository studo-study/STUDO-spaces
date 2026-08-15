"use client";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { Plus } from "lucide-react";
import CreateCoursePopup from "@/components/ui/app/private/course/CreateCourse";
import { useState, type FC } from "react";
import BaseTooltip from "@studo/ui/design_system/tooltip/BaseToolTip";
import { useTranslations } from "next-intl";

const CreateCourse: FC = () => {
  const t = useTranslations("createstudoset");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className={"relative"}>
      <BaseTooltip content={t("create_course")}>
        <BaseButton
          className={"bg-purple-500 text-lg h-9 min-w-9"}
          onClick={() => setIsOpen((prev) => !prev)}
          size={"icon"}
          variant={"plus"}
        >
          <Plus size={25} />
        </BaseButton>
      </BaseTooltip>
      <CreateCoursePopup
        createOpen={isOpen}
        setCreateOpen={setIsOpen}
        noRedirect
      />
    </div>
  );
};

CreateCourse.displayName = "CreateCourse";
export default CreateCourse;
