import { useTranslations } from "next-intl";
import { TbCards } from "react-icons/tb";
import { IoAdd } from "react-icons/io5";
import { Link } from "@/i18n/routing";
import { FaChevronRight } from "react-icons/fa";

interface SetOverviewProps {
  id: string;
}
const SetOverview = ({ id }: SetOverviewProps) => {
  const t = useTranslations("flow.course");
  return (
    <div className={"w-full flex flex-col gap-5  mb-8"}>
      <div
        className={
          "w-full flex items-center justify-between gap-2 font-bold text-lg"
        }
      >
        <div className={"flex items-center gap-2"}>
          <TbCards />
          <span>{t("flow_title")}</span>
        </div>
        <Link
          href={"/course/" + id + "/sets"}
          className={"flex items-center gap-2 text-sm opacity-50"}
        >
          {t("more_sets")}
          <FaChevronRight />
        </Link>
      </div>
      <div className={"h-30 flex flex-row gap-5 w-full"}>
        <div className={"flex flex-1 flex-row gap-5"}>
          <div
            className={
              "w-1/4 h-full rounded-3xl border text-studogrey border-studoborder flex items-center justify-center"
            }
          />
          <div
            className={
              "w-1/4 h-full rounded-3xl border text-studogrey border-studoborder flex items-center justify-center"
            }
          />
          <div
            className={
              "w-1/4 h-full rounded-3xl border text-studogrey border-studoborder flex items-center justify-center"
            }
          />
          <div
            className={
              "w-1/4 h-full rounded-3xl border text-studogrey border-studoborder flex items-center justify-center"
            }
          />
        </div>
        <button
          className={
            "w-1/5 h-full rounded-3xl border text-studogrey border-studoborder border-dashed flex items-center justify-center"
          }
        >
          <IoAdd />
        </button>
      </div>
    </div>
  );
};

SetOverview.displayName = "SetOverview";
export default SetOverview;
