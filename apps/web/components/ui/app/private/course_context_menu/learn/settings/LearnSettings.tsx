import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";

const LearnSettings = () => {
  return (
    <div className={"min-h-0 w-full flex flex-col flex-1"}>
      <ContextMenuHeader t={"settings"} />
    </div>
  );
};

LearnSettings.displayName = "LearnSettings";
export default LearnSettings;
