"use client";
import { useTranslations } from "next-intl";
import TriggerClassroom from "@/components/ui/app/private/classrooms/CreateClassroom";
import { useState } from "react";
import CreateClassroom from "@/components/ui/app/private/classrooms/CreateClassroomPopup";

export default function ClassroomsHeader() {
  const t = useTranslations("groups");
  const [classroomIsOpen, setClassroomIsOpen] = useState(false);
  const togglePopUp = () => {
    setClassroomIsOpen((prev) => !prev);
  };

  return (
    <div
      className={
        "relative max-w-full min-h-20 flex flex-col justify-between items-center max-h-100"
      }
    >
      <div className={"w-full h-fit flex items-center justify-between"}>
        <div className={"flex flex-col gap-1 w-full"}>
          <span
            className={"w-full font-bold dark:text-white text-2xl font-georgia"}
          >
            {t("title")}
          </span>
          <span className="dark:text-studogrey text-gray-400">
            {t("subtitle")}
          </span>
        </div>
        <TriggerClassroom togglePopUp={togglePopUp} />
      </div>
      <div className={"w-full z-10 bottom-0 h-0.5 bg-studogrey"} />
      <CreateClassroom
        createOpen={classroomIsOpen}
        setCreateOpen={setClassroomIsOpen}
      />
    </div>
  );
}
