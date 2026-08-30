import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { LoaderCircle, File } from "lucide-react";
import { CourseDocument } from "@studo/types";
import { useTranslations } from "next-intl";

interface BottomProgressProps {
  files: File[];
  processingDocs: CourseDocument[];
}
const BottomProgress: React.FC<BottomProgressProps> = (props) => {
  const { files, processingDocs } = props;
  const t = useTranslations("flow.course");
  return (
    <div
      className={
        "absolute -bottom-5 left-1/2 -translate-1/2 z-90 shadow-xl max-w-100 w-fit rounded-full p-3 bg-studogrey/30 border border-studoborder/30 flex flex-row items-center gap-5 divide-x divide-studoborder/30"
      }
    >
      <div
        className={
          "flex flex-row items-center pr-3 text-sm text-studogrey/30 gap-2 font-bold"
        }
      >
        <BaseButton
          label={processingDocs[0]?.title}
          variant={"hover"}
          size={"sm"}
          iconLeft={<File size={12} />}
        />
        <span className={"dark:text-white text-studodarkblue font-normal"}>
          1
        </span>
        /
        <span className={"dark:text-white text-studodarkblue font-normal"}>
          {files.length + processingDocs.length}
        </span>
      </div>
      <BaseButton
        label={files.length === 0 ? t("stop_processing") : t("stop_upload")}
        size={"sm"}
        iconLeft={<LoaderCircle className={"animate-spin"} size={14} />}
      />
    </div>
  );
};

BottomProgress.displayName = "BottomProgress";
export default BottomProgress;
