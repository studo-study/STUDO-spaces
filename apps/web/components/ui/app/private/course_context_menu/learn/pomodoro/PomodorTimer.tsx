import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";

const PomodorTimer: React.FC = () => {
  return (
    <div className={"min-h-0 w-full flex flex-col flex-1"}>
      <ContextMenuHeader t={"pomodoro"} />
    </div>
  );
};

PomodorTimer.displayName = "PomodorTimer";
export default PomodorTimer;
