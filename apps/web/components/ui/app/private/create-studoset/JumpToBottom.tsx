import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import AnimateOnScroll from "@/components/ui/overige/effects/AnimateOnScroll";

interface JumpToBottomProps {
  jumpToTop: () => void;
  jumpToBottom: () => void;
}
const JumpToBottom = ({ jumpToTop, jumpToBottom }: JumpToBottomProps) => {
  return (
    <AnimateOnScroll className={"fixed top-1/2 right-10 "}>
      <div
        className={
          "h-20 w-10 rounded-3xl flex items-center justify-between flex-col border border-studoborder/30 hover:border-studoborder transition-colors duration-300 bg-studogrey/30 shadow-lg"
        }
      >
        <BaseButton
          variant={"ghost"}
          icon={<IoIosArrowUp />}
          onClick={() => jumpToTop()}
        />
        <BaseButton
          variant={"ghost"}
          icon={<IoIosArrowDown />}
          onClick={() => jumpToBottom()}
        />
      </div>
    </AnimateOnScroll>
  );
};

JumpToBottom.displayName = "JumpToBottom";
export default JumpToBottom;
