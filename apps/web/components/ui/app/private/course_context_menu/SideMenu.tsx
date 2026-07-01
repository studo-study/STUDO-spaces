"use client";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { X } from "lucide-react";
import { useSideMenu } from "@/components/ui/app/private/course_context_menu/store/CourseStore";
import SvenChat from "@/components/ui/app/private/course_context_menu/chat/SvenChat";
import PdfReader from "@/components/ui/app/private/course_context_menu/pdf_reader/PdfReader";

interface SideMenuProps {
  origin: string;
}

const SideMenuTitles: Record<string, string> = {
  chat: "Chat",
  course: "Course",
  quick_actions: "Quick Actions",
};
const SideMenu: React.FC<SideMenuProps> = (props) => {
  const { origin } = props;
  const title = SideMenuTitles[origin];
  const setMenuOpen = useSideMenu((state) => state.setMenuInfo);
  return (
    <div className="h-full w-full border-l flex flex-col border-studoborder/30">
      <div className="w-full border-b border-studoborder/30 flex justify-between font-bold dark:text-white items-center px-5 py-5">
        {title}
        <BaseButton
          onClick={() => setMenuOpen({ isOpen: false, origin: null })}
          size={"xs"}
          shape="circle"
          icon={<X />}
        />
      </div>
      {origin === "chat" && <SvenChat />}
      {origin === "course" && <PdfReader />}
    </div>
  );
};

SideMenu.displayName = "SideMenu";
export default SideMenu;
