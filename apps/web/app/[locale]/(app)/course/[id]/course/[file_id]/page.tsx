"use client";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { IoArrowBackOutline } from "react-icons/io5";
import { usePathname, useRouter } from "@/i18n/routing";

export default function CourseDetailPage() {
  const id = usePathname().split("/")[2];
  console.log(id);
  const Router = useRouter();
  return (
    <div className={"w-full h-full flex flex-col"}>
      <div className={"h-10 w-full flex flex-row items-center gap-3 mb-2"}>
        <BaseButton
          size="sm"
          variant="icon"
          onClick={() => Router.push("/course/" + id + "/course")}
        >
          <IoArrowBackOutline />
        </BaseButton>
        <span>title</span>
      </div>
      <div></div>
    </div>
  );
}
