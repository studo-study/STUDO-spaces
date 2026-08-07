import BaseButton from "@/components/ui/design_system/button/BaseButton";
import {
  ArrowDownUp,
  Funnel,
  Grid2x2Plus,
  SlidersHorizontal,
} from "lucide-react";
import SvenIcon from "@/components/ui/overige/icons/SvenLogo";

const TableControls = () => {
  return (
    <div className={"flex flex-row gap-1 items-center "}>
      <BaseButton
        icon={<Funnel size={14} />}
        variant={"hover"}
        size={"sm"}
        shape={"circle"}
      />
      <BaseButton
        icon={<ArrowDownUp size={14} />}
        variant={"hover"}
        size={"sm"}
        shape={"circle"}
      />
      <BaseButton
        icon={<SvenIcon size={14} />}
        variant={"hover"}
        size={"sm"}
        shape={"circle"}
      />
      <BaseButton
        icon={<SlidersHorizontal size={14} />}
        variant={"hover"}
        size={"sm"}
        shape={"circle"}
      />
      <BaseButton
        variant={"submit"}
        className={"w-fit max-h-8 px-2"}
        label={"add row"}
        size={"sm"}
        iconLeft={<Grid2x2Plus size={15} />}
      />
    </div>
  );
};

TableControls.displayName = "TableControls";
export default TableControls;
