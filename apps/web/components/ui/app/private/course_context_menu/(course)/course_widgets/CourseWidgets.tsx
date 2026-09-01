"use client";
import { Check, Pencil, Plus } from "lucide-react";
import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";
import { useWidgetMenu } from "@/store/course_context_menu/WidgetMenuStore";
import {
  WIDGET_REGISTRY,
  WIDGET_TYPES,
} from "@/components/ui/app/private/course/overview/widgetRegistry";

const CourseWidgets = () => {
  const editMode = useWidgetMenu((s) => s.editMode);
  const setEditMode = useWidgetMenu((s) => s.setEditMode);
  const addWidget = useWidgetMenu((s) => s.addWidget);

  return (
    <div className={"min-h-0 w-full flex flex-col flex-1 gap-2"}>
      <ContextMenuHeader t={"widgets"} />

      <div className={"min-h-0 flex-1 flex flex-col gap-4 px-4 pt-2"}>
        <button
          type={"button"}
          onClick={() => setEditMode(!editMode)}
          className={
            "flex items-center justify-center gap-2 h-10 rounded-full border border-neutral-200/30 bg-studogrey/30 text-sm font-semibold hover:border-neutral-400 dark:text-white transition-colors"
          }
        >
          {editMode ? <Check size={15} /> : <Pencil size={15} />}
          {editMode ? "Done" : "Edit layout"}
        </button>

        <div className={"flex flex-col gap-2"}>
          {WIDGET_TYPES.map((type) => {
            const def = WIDGET_REGISTRY[type];
            return (
              <button
                key={type}
                type={"button"}
                onClick={() => addWidget(type)}
                className={
                  "flex items-center cursor-pointer gap-3 h-11 px-4 rounded-2xl border border-neutral-200/30 bg-studogrey/30 hover:border-neutral-400 transition-colors text-sm"
                }
              >
                <span className={"dark:text-white"}>{def.icon}</span>
                <span className={"font-medium capitalize dark:text-white"}>
                  {def.label}
                </span>
                <Plus size={15} className={"ml-auto text-studogrey"} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

CourseWidgets.displayName = "CourseWidgets";
export default CourseWidgets;
