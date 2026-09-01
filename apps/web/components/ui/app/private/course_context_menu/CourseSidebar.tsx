"use client";
import BaseTooltip from "@studo/ui/design_system/tooltip/BaseToolTip";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import {
  BookSearch,
  Clock,
  LayoutGrid,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import {
  MenuOrigin,
  useSideMenu,
} from "@/store/course_context_menu/SideMenuStore";
import { usePathname } from "@/i18n/routing";
import { useLearnStore } from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";
import { MenuConfig, resolveMenuConfig } from "./config";
import SvenIcon from "@/components/ui/overige/icons/SvenLogo";

const CourseSidebar: React.FC = () => {
  const menuOpen = useSideMenu((state) => state.menuInfo);
  const setMenuOpen = useSideMenu((state) => state.setMenuInfo);
  const pathname = usePathname();
  const menuConfig = resolveMenuConfig(pathname);
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

  const MenuItems: {
    key: keyof MenuConfig;
    tooltip: string;
    onclick: () => void;
    icon: React.ReactNode;
    isEnabled: boolean;
  }[] = [
    {
      key: "pomodoro",
      tooltip: "Pomodoro Timer",
      onclick: () => toggleMenu("pomodoro"),
      icon: <Clock size={17} />,
      isEnabled: pomodoroEnabled,
    },
    {
      key: "learn_settings",
      tooltip: "Settings",
      onclick: () => toggleMenu("settings"),
      icon: <Settings size={17} />,
      isEnabled: true,
    },
    {
      key: "chat",
      tooltip: "Ask Sven",
      onclick: () => toggleMenu("chat"),
      icon: <SvenIcon size={18} />,
      isEnabled: true,
    },
    {
      key: "check_course",
      tooltip: "See in course",
      onclick: () => toggleMenu("course"),
      icon: <BookSearch size={17} />,
      isEnabled: true,
    },
    {
      key: "quick_actions",
      tooltip: "Quick Actions",
      onclick: () => toggleMenu("quick_actions"),
      icon: <SlidersHorizontal size={17} />,
      isEnabled: true,
    },
    {
      key: "widgets",
      tooltip: "Widgets",
      onclick: () => toggleMenu("widgets"),
      icon: <LayoutGrid size={17} />,
      isEnabled: true,
    },
    {
      key: "doc_settings",
      tooltip: "Document Settings",
      onclick: () => toggleMenu("doc_settings"),
      icon: <Settings size={17} />,
      isEnabled: true,
    },
  ];
  return (
    <div className="shrink-0 w-20 h-full border-neutral-200/30 shadow-3xl border-l bg-studogrey/10 flex flex-col gap-5 py-5 items-center justify-start">
      {MenuItems.filter((item) => menuConfig[item.key] && item.isEnabled).map(
        (item) => (
          <BaseTooltip key={item.key} content={item.tooltip} position={"left"}>
            <BaseButton
              onClick={item.onclick}
              variant={"outline_link"}
              size={"icon"}
            >
              {item.icon}
            </BaseButton>
          </BaseTooltip>
        ),
      )}
    </div>
  );
};

CourseSidebar.displayName = "CourseSidebar";
export default CourseSidebar;
