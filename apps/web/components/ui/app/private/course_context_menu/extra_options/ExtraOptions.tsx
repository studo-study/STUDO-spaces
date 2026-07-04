import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";

const ExtraOptions = () => {
  return (
    <div className={"min-h-0 w-full flex flex-col flex-1"}>
      <ContextMenuHeader t={"extra_options"} />
    </div>
  );
};

ExtraOptions.displayName = "ExtraOptions";
export default ExtraOptions;
