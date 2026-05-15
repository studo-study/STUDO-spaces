import { HiOutlineViewList } from "react-icons/hi";
import { BsGridFill } from "react-icons/bs";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

interface GridSwitcherProps {
  grid: boolean;
  setGrid: (grid: boolean) => void;
}

const GridSwitcher = (props: GridSwitcherProps) => {
  const { setGrid, grid } = props;
  return (
    <>
      <BaseButton
        onClick={() => setGrid(false)}
        className={`${!grid ? "border-studoblue dark:border-white text-studoblue dark:text-white bg-studoblue/30 dark:bg-studogrey" : "border-studoblue dark:border-studoborder text-studoblue dark:text-studoborder"} cursor-pointer border w-8 h-8 rounded-lg text-lg flex items-center justify-center`}
      >
        <HiOutlineViewList />
      </BaseButton>
      <BaseButton
        onClick={() => setGrid(true)}
        className={`${grid ? "border-studoblue bg-studoblue/30 dark:bg-studogrey dark:border-white text-studoblue dark:text-white" : "border-studoblue dark:border-studoborder text-studoblue dark:text-studoborder"} cursor-pointer w-8 h-8 rounded-lg border text-lg flex items-center justify-center`}
      >
        <BsGridFill />
      </BaseButton>
    </>
  );
};

export default GridSwitcher;
