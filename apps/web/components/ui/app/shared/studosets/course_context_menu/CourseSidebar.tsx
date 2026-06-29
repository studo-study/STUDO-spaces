import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { BookSearch, Flower, SlidersHorizontal } from "lucide-react";
import { SetStateAction } from "react";

interface CourseSidebarProps {
  setMenuOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CourseSidebar: React.FC<CourseSidebarProps> = (props) => {
  const { setMenuOpen } = props;
  return (
    <div className="shrink-0 w-20 h-full border-l border-studoborder/30 flex flex-col gap-5 py-5 items-center justify-start">
      <BaseTooltip content={"Ask Sven"} position={"left"}>
        <BaseButton
          onClick={() => setMenuOpen((prev) => !prev)}
          variant={"outline_link"}
          size={"icon"}
        >
          <Flower size={17} />
        </BaseButton>
      </BaseTooltip>
      <BaseTooltip content={"See in course"} position={"left"}>
        <BaseButton
          onClick={() => setMenuOpen((prev) => !prev)}
          variant={"outline_link"}
          size={"icon"}
        >
          <BookSearch size={17} />
        </BaseButton>
      </BaseTooltip>
      <BaseTooltip content={"Quick actions"} position={"left"}>
        <BaseButton
          onClick={() => setMenuOpen((prev) => !prev)}
          variant={"outline_link"}
          size={"icon"}
        >
          <SlidersHorizontal size={17} />
        </BaseButton>
      </BaseTooltip>
    </div>
  );
};

CourseSidebar.displayName = "CourseSidebar";
export default CourseSidebar;
