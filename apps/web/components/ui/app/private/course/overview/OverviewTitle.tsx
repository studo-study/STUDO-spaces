import { FullCourseResponse } from "@studo/types";
import { ReactNode, useCallback } from "react";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useTranslations } from "next-intl";
import { useUpdateCourse } from "@/hooks/app/courses/useUpdateCourse";
import FlowIcon from "@/components/ui/app/private/course/layout/FlowIcon";
import classNames from "@/utils/classnames";
import DatePicker from "@studo/ui/design_system/date_picker/DatePicker";
import BaseTooltip from "@studo/ui/design_system/tooltip/BaseToolTip";
import { useDeleteCourse } from "@/hooks/app/courses/useDeleteCourse";
import { Trash } from "lucide-react";
import ItemOptions from "@studo/ui/design_system/item_options/ItemOptions";
import { useRouter } from "@/i18n/routing";

interface DatumChipProps {
  datum?: string;
  updateDate: (input: string) => void;
}
const DatumChip: React.FC<DatumChipProps> = (props) => {
  const { datum, updateDate } = props;
  const t = useTranslations("flow.course");
  const date = datum ? new Date(datum) : null;
  return (
    <BaseTooltip content={t("exam_date")} position={"bottom"}>
      <div
        className={classNames(
          "w-fit px-2 py-1 text-sm cursor-pointer bg-studogrey/30 font-bold rounded-full border border-studoborder/30",
        )}
      >
        <DatePicker
          iconColor={"text-emerald-400"}
          size={"sm"}
          variant={"ghost"}
          value={date ?? null}
          onChange={(input) => updateDate(input.toISOString())}
        />
      </div>
    </BaseTooltip>
  );
};

interface OverviewTitleProps {
  course: FullCourseResponse | null;
  id: string;
  action?: ReactNode;
}

const OverviewTitle: React.FC<OverviewTitleProps> = (props) => {
  const { id, action, course } = props;
  const toast = useToast();
  const t = useTranslations("flow.course");
  const updateCourse = useUpdateCourse(id);
  const updateDate = useCallback(
    (input: string) => updateCourse.mutate({ examDate: input }),
    [updateCourse],
  );
  const { mutate: deleteCourse } = useDeleteCourse();
  const Router = useRouter();

  return (
    <div className={"w-full h-fit flex flex-row justify-between gap-5"}>
      <div className={"flex flex-col gap-5"}>
        <div
          className={"flex flex-row w-full items-center justify-between gap-2"}
        >
          <div className={"flex flex-row gap-3 items-center"}>
            <FlowIcon
              icon={course?.icon ?? ""}
              size={25}
              className={"min-w-15 min-h-15 w-15 h-15 rounded-2xl shrink-0"}
            />
            <div className={"flex flex-col gap-1"}>
              <input
                className={"text-2xl font-bold group outline-none"}
                defaultValue={course?.title}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    toast.error(t("no_title_error"));
                    return;
                  }
                  updateCourse.mutate({ title: e.target.value });
                }}
                placeholder={t("set_course_title")}
              />
              <input
                className={
                  " font-medium text-studogrey text-base group outline-none"
                }
                defaultValue={course?.description ?? ""}
                onBlur={(e) => {
                  updateCourse.mutate({ description: e.target.value });
                }}
                placeholder={t("set_course_description")}
              />
            </div>
          </div>
          {action}
        </div>
        <div className={"w-full flex flex-row gap-3"}>
          <DatumChip datum={course?.examDate ?? ""} updateDate={updateDate} />
        </div>
      </div>
      <div>
        <ItemOptions
          options={[
            {
              label: t("delete"),
              icon: <Trash size={15} />,
              onClick: (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                deleteCourse(course?.id ?? "");
                Router.push("/home");
              },
              danger: true,
            },
          ]}
        />
      </div>
    </div>
  );
};

OverviewTitle.displayName = "OverviewTitle";
export default OverviewTitle;
