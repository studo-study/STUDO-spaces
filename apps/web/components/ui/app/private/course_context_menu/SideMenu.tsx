import SvenChat from "@/components/ui/app/private/course_context_menu/chat/SvenChat";
import PomodorTimer from "@/components/ui/app/private/course_context_menu/learn/pomodoro/PomodoroTimer";
import LearnSettings from "@/components/ui/app/private/course_context_menu/learn/settings/LearnSettings";
import ExtraOptions from "@/components/ui/app/private/course_context_menu/extra_options/ExtraOptions";
import { usePathname } from "@/i18n/routing";
import CourseWidgets from "@/components/ui/app/private/course_context_menu/(course)/course_widgets/CourseWidgets";
import DocumentSettings from "@/components/ui/app/private/course_context_menu/(course)/document_settings/DocumentSettings";
import CourseOverview from "@/components/ui/app/private/course_context_menu/pdf_reader/CourseOverview";

interface SideMenuProps {
  origin: string;
}

const SideMenu: React.FC<SideMenuProps> = (props) => {
  const { origin } = props;
  const path = usePathname();
  const isOnLearn = path.split("/")[1] === "learn";

  return (
    <div className="relative h-full w-full flex flex-col bg-studogrey/5 border-l border-neutral-200/30">
      {origin === "pomodoro" && isOnLearn && <PomodorTimer />}
      {origin === "settings" && isOnLearn && <LearnSettings />}
      {origin === "chat" && <SvenChat />}
      {origin === "chat_history" && <SvenChat />}
      {origin === "course" && <CourseOverview />}
      {origin === "quick_actions" && <ExtraOptions />}
      {origin === "widgets" && <CourseWidgets />}
      {origin === "doc_settings" && <DocumentSettings />}
    </div>
  );
};

SideMenu.displayName = "SideMenu";
export default SideMenu;
