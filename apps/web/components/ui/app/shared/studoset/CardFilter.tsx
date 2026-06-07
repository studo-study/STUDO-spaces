import SimpleMenu from "@/components/ui/design_system/simple_menu/SimpleMenu";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { IoFilter } from "react-icons/io5";

const CardFilter = () => {
  return (
    <SimpleMenu
      trigger={<BaseButton variant="icon" icon={<IoFilter />} size={"sm"} />}
    ></SimpleMenu>
  );
};

CardFilter.displayName = "CardFilter";
export default CardFilter;
