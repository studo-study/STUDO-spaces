import {
  COURSE_GRID_TEMPLATE,
  TableColumns,
} from "@/components/ui/app/private/course/flow/table/TableColumns";
import { useTranslations } from "next-intl";
import classNames from "@/utils/classnames";

const TableHeader = () => {
  const t = useTranslations("flow.course.table.header");
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: COURSE_GRID_TEMPLATE,
        gridTemplateRows: "max-content",
      }}
      className={
        "w-full max-h-10 border-b border-studoborder/30 text-studogrey"
      }
    >
      {TableColumns.map((col, index) => {
        const Icon = col.icon;
        return (
          <div
            className={classNames(
              "h-10 flex capitalize cursor-pointer font-medium items-center gap-2 hover:bg-studogrey/30 transition-colors duration-300 group",
            )}
            key={col.colId + index}
            style={{
              width: col.width,
              minWidth: col.minWidth,
              maxWidth: col.maxWidth,
            }}
          >
            <div className={"px-3 gap-2 min-h-0 flex-1 flex items-center"}>
              <Icon size={15} />
              {t(col.label)}
            </div>
            <button
              type={"button"}
              className={
                "h-10 cursor-col-resize w-1 border-r border-studoborder/30 group-last-of-type:border-r-0"
              }
            />
          </div>
        );
      })}
    </div>
  );
};

TableHeader.displayName = "TableHeader";
export default TableHeader;
