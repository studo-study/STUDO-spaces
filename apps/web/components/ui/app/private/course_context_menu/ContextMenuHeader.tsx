import BaseToolTip from "@/components/ui/design_system/tooltip/BaseToolTip";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSideMenu } from "@/store/course_context_menu/SideMenuStore";

interface ContextMenuHeadrProps {
  t?: string;
}
const ContextMenuHeader: React.FC<ContextMenuHeadrProps> = (props) => {
  const t = useTranslations(props.t ?? "");
  const setMenuInfo = useSideMenu((state) => state.setMenuInfo);
  return (
    <div
      className={
        "relative min-w-full pt-4 px-4 flex flex-row items-center justify-center"
      }
    >
      <span
        className={
          "h-8 flex items-center justify-center text-sm font-semibold dark:text-white"
        }
      >
        {props.t && t("title")}
      </span>
      <div className={"absolute right-4 top-4"}>
        <BaseToolTip content={"Close"} position={"bottom"}>
          <BaseButton
            onClick={() => setMenuInfo({ isOpen: false, origin: null })}
            size={"xs"}
            variant={"ghost"}
            shape="circle"
            icon={<X size={15} />}
          />
        </BaseToolTip>
      </div>
    </div>
  );
};

ContextMenuHeader.displayName = "ContextMenuHeader";
export default ContextMenuHeader;
