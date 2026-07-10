import SvenChat from "@/components/ui/app/private/course_context_menu/chat/SvenChat";
import PdfReader from "@/components/ui/app/private/course_context_menu/pdf_reader/PdfReader";
import PomodorTimer from "@/components/ui/app/private/course_context_menu/learn/pomodoro/PomodoroTimer";
import LearnSettings from "@/components/ui/app/private/course_context_menu/learn/settings/LearnSettings";
import ExtraOptions from "@/components/ui/app/private/course_context_menu/extra_options/ExtraOptions";
import { usePathname } from "@/i18n/routing";
import CourseWidgets from "@/components/ui/app/private/course_context_menu/course_widgets/CourseWidgets";

interface SideMenuProps {
  origin: string;
}

const SideMenu: React.FC<SideMenuProps> = (props) => {
  const { origin } = props;
  const path = usePathname();
  const isOnLearn = path.split("/")[1] === "learn";

  return (
    <div className="relative h-full w-full border-l flex flex-col bg-studogrey/5  border-studoborder/30">
      {origin === "pomodoro" && isOnLearn && <PomodorTimer />}
      {origin === "settings" && isOnLearn && <LearnSettings />}
      {origin === "chat" && <SvenChat />}
      {origin === "chat_history" && <SvenChat />}
      {origin === "course" && <PdfReader />}
      {origin === "quick_actions" && <ExtraOptions />}
      {origin === "widgets" && <CourseWidgets />}
    </div>
  );
};

SideMenu.displayName = "SideMenu";
export default SideMenu;
