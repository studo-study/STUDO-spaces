"use client";
import WigetGridLayout from "@/components/ui/app/private/course/overview/WigetGridLayout";
import { useParams } from "next/navigation";
import { useCourse } from "@/hooks/app/courses/useCourse";
import EmptyFallback from "@studo/ui/design_system/EmptyFallback";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import UploadModal from "@/components/ui/app/private/course/cursus/cursus_overview/UploadModal";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { useUploadFile } from "@/hooks/app/courses/useUploadFile";
import { useToast } from "@/components/providers/app/ToastProvider";
import { Sparkles } from "lucide-react";
import { ComposerAura } from "@studo/ui/design_system/composer_aura/ComposerAura";
import OverviewTitle from "@/components/ui/app/private/course/overview/OverviewTitle";

const MAX_FILES = 3;
const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export default function CourseOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("flow.course");
  const course = useCourse(id)?.data;
  const noCourse = course?.documents.length === 0;

  const toast = useToast();
  const upload = useUploadFile(id);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const valid = Array.from(incoming)
        .filter((f) => ACCEPTED.includes(f.type))
        .slice(0, MAX_FILES);
      if (valid.length === 0) {
        toast.error(t("error_file_types"));
        return;
      }
      upload.mutate(valid, {
        onError: () => toast.error(t("error_upload")),
      });
    },
    [t, toast, upload],
  );

  return (
    <div
      className={"min-w-0 min-h-0 flex-1 flex flex-col items-center gap-5 p-5"}
    >
      <OverviewTitle course={course ?? null} id={id} />
      {noCourse && (
        <EmptyFallback
          title={t("no_docs")}
          cta={
            <ComposerAura>
              <BaseButton
                onClick={() => setUploadModalOpen(true)}
                type="button"
                variant="submit"
                className={"border-studoblue"}
                label={t("cta")}
                iconLeft={
                  <Sparkles
                    size={17}
                    className={"dark:fill-white fill-studodarkblue stroke-0.5"}
                  />
                }
              />
            </ComposerAura>
          }
          icon={"boxes"}
        />
      )}
      <div className={"w-full max-w-200 min-w-0 min-h-0 flex-1 flex flex-col"}>
        <WigetGridLayout courseId={id} />
      </div>
      <UploadModal
        addFiles={addFiles}
        isOpen={uploadModalOpen}
        setIsOpen={setUploadModalOpen}
      />
    </div>
  );
}
