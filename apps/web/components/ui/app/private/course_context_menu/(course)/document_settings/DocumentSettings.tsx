import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";
import { useTranslations } from "next-intl";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useReprocessDocument } from "@/hooks/app/courses/useReprocessDocument";
import { usePathname } from "@/i18n/routing";

const DocumentSettings = () => {
  const t = useTranslations("flow.course.document_settings");
  const toast = useToast();
  const path = usePathname().split("/");
  const courseId = path[2];
  const docId = path[path.length - 1];

  const { mutate: reprocess, isPending: isResetting } = useReprocessDocument(
    courseId,
    docId,
  );

  return (
    <div className={"min-h-0 w-full flex flex-col flex-1 gap-2"}>
      <ContextMenuHeader t={"settings"} />
      <div className={"flex-1 min-h-0 px-8"}></div>
      <div className={"flex p-8 flex-1 min-h-0 flex-col items-end justify-end"}>
        <div className={"flex flex-row"}>
          <BaseButton
            disabled={isResetting}
            variant={"danger"}
            label={t("reprocess_btn")}
            onClick={() => {
              reprocess();
              toast.success("started reprocessing document");
            }}
          />
        </div>
      </div>
    </div>
  );
};

DocumentSettings.displayName = "DocumentSettings";
export default DocumentSettings;
