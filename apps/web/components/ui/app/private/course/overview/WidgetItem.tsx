import classNames from "@/utils/classnames";
import { EllipsisVertical, Grip, Trash2 } from "lucide-react";
import { useWidgetMenu } from "@/store/course_context_menu/WidgetMenuStore";
import SimpleMenu from "@studo/ui/design_system/simple_menu/SimpleMenu";
import {
  WIDGET_REGISTRY,
  type WidgetType,
} from "@/components/ui/app/private/course/overview/widgetRegistry";

interface WidgetItemProps {
  id: string;
  type: WidgetType;
}
const WidgetItem: React.FC<WidgetItemProps> = (props) => {
  const { id, type } = props;
  const editMode = useWidgetMenu((state) => state.editMode);
  const removeWidget = useWidgetMenu((state) => state.removeWidget);

  return (
    <div
      className={classNames(
        "group relative h-full max-h-60 w-full border border-neutral-200/30 transition-colors duration-300 rounded-3xl p-4 bg-studogrey/30 hover:border-neutral-400",
        editMode && "border-dashed animate-widget-wiggle",
      )}
    >
      {WIDGET_REGISTRY[type].render()}

      <div className={"absolute top-3 right-3 active:animate-none"}>
        {!editMode ? (
          <SimpleMenu
            variant={"entity"}
            trigger={
              <button
                type={"button"}
                aria-label={"Widget options"}
                className={
                  "flex h-6 w-6 items-center justify-center rounded-lg text-neutral-400  transition-opacity duration-200 cursor-pointer hover:bg-studogrey/40"
                }
              >
                <EllipsisVertical size={14} />
              </button>
            }
          >
            <div className={"flex flex-col gap-3"}>
              <button
                type={"button"}
                onClick={() => removeWidget(id)}
                className={
                  "flex w-40 h-10 items-center gap-2 rounded-full border border-neutral-200/30 bg-studogrey/30 px-4 text-sm text-rose-500 hover:bg-rose-500/10"
                }
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </SimpleMenu>
        ) : (
          <button
            type={"button"}
            aria-label={"Drag widget"}
            className={
              "widget-drag-handle flex h-6 w-6 items-center justify-center rounded-lg text-studogrey transition-colors cursor-grab active:cursor-grabbing hover:bg-studogrey/40"
            }
          >
            <Grip size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

WidgetItem.displayName = "WidgetItem";
export default WidgetItem;
