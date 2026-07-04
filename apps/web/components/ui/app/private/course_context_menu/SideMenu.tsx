import SvenChat from "@/components/ui/app/private/course_context_menu/chat/SvenChat";
import PdfReader from "@/components/ui/app/private/course_context_menu/pdf_reader/PdfReader";
import { useParams } from "next/navigation";
import PomodorTimer from "@/components/ui/app/private/course_context_menu/learn/pomodoro/PomodorTimer";
import LearnSettings from "@/components/ui/app/private/course_context_menu/learn/settings/LearnSettings";
import ExtraOptions from "@/components/ui/app/private/course_context_menu/extra_options/ExtraOptions";

interface SideMenuProps {
  origin: string;
}

const SideMenu: React.FC<SideMenuProps> = (props) => {
  const { origin } = props;
  const path = useParams();
  console.log(path);
  return (
    <div className="relative h-full w-full border-l flex flex-col bg-studogrey/5  border-studoborder/30">
      {origin === "chat" && <SvenChat />}
      {origin === "course" && <PdfReader />}
      {origin === "pomodoro" && <PomodorTimer />}
      {origin === "settings" && <LearnSettings />}
      {origin === "options'" && <ExtraOptions />}
    </div>
  );
};

SideMenu.displayName = "SideMenu";
export default SideMenu;
