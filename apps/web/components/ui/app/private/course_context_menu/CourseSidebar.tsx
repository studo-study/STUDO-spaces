"use client";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import {
  BookSearch,
  Clock,
  Flower,
  History,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { MenuOrigin, useSideMenu } from "@/store/coursecontextmenu/CourseStore";
import { usePathname } from "@/i18n/routing";
import { useLearnStore } from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";

const CourseSidebar: React.FC = () => {
  const menuOpen = useSideMenu((state) => state.menuInfo);
  const setMenuOpen = useSideMenu((state) => state.setMenuInfo);
  const pathname = usePathname();
  const LearnMode = pathname.split("/").includes("learn");
  const pomodoroEnabled = useLearnStore(
    (state) => state.learnSettings.pomodoro,
  );
  const toggleMenu = (input: string) => {
    if (input === menuOpen.origin && menuOpen.isOpen) {
      setMenuOpen({ isOpen: false, origin: null });
    }
    if (input != menuOpen.origin) {
      setMenuOpen({ isOpen: true, origin: input as MenuOrigin });
    }
  };
  return (
    <div className="shrink-0 w-20 h-full border-l border-studoborder/30 flex flex-col gap-5 py-5 items-center justify-start">
      {LearnMode && (
        <>
          {pomodoroEnabled && (
            <BaseTooltip content={"Pomodoro Timer"} position={"left"}>
              <BaseButton
                onClick={() => toggleMenu("pomodoro")}
                variant={"outline_link"}
                size={"icon"}
              >
                <Clock size={17} />
              </BaseButton>
            </BaseTooltip>
          )}
          <BaseTooltip content={"Settings"} position={"left"}>
            <BaseButton
              onClick={() => toggleMenu("settings")}
              variant={"outline_link"}
              size={"icon"}
            >
              <Settings size={17} />
            </BaseButton>
          </BaseTooltip>
        </>
      )}
      <BaseTooltip content={"Ask Sven"} position={"left"}>
        <BaseButton
          onClick={() => toggleMenu("chat")}
          variant={"outline_link"}
          size={"icon"}
        >
          <Flower size={17} />
        </BaseButton>
      </BaseTooltip>
      <BaseTooltip content={"Chat history"} position={"left"}>
        <BaseButton
          onClick={() => toggleMenu("chat_history")}
          variant={"outline_link"}
          size={"icon"}
        >
          <History size={17} />
        </BaseButton>
      </BaseTooltip>
      <BaseTooltip content={"See in course"} position={"left"}>
        <BaseButton
          onClick={() => toggleMenu("course")}
          variant={"outline_link"}
          size={"icon"}
        >
          <BookSearch size={17} />
        </BaseButton>
      </BaseTooltip>
      <BaseTooltip content={"Quick actions"} position={"left"}>
        <BaseButton
          onClick={() => toggleMenu("quick_actions")}
          variant={"outline_link"}
          size={"icon"}
        >
          <SlidersHorizontal size={17} />
        </BaseButton>
      </BaseTooltip>
    </div>
  );
};

CourseSidebar.displayName = "CourseSidebar";
export default CourseSidebar;
