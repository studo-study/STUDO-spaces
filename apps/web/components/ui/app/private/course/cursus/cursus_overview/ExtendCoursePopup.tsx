import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import BasePopup from "@/components/ui/design_system/popup/BasePopup";
import React, { SetStateAction, useRef, useState } from "react";
import { RiAiGenerate } from "react-icons/ri";
import { useTranslations } from "next-intl";

interface ExtendCoursePopupProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}
const ExtendCoursePopup: React.FC<ExtendCoursePopupProps> = (props) => {
  const ref = useRef(null);
  const { isOpen, setIsOpen } = props;
  const [isDragging, setIsDragging] = useState(false);
  const t = useTranslations("");
  return (
    <PopupBackdrop isOpen={isOpen} setIsOpen={setIsOpen} blur>
      <BasePopup popupRef={ref} isOpen={isOpen} width="1/3" className={"flex"}>
        <div className={"w-full flex-1 min-h-0 p-5 flex flex-col"}>
          <span className={"mb-3 text-xl text-white font-semibold"}>
            Extend Course
          </span>
          <div
            className={
              "border border-studoborder flex items-center flex-col justify-center gap-10 bg-studogrey/10 w-full h-full rounded-lg min-h-0 flex-1"
            }
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full dark:bg-white/3 bg-black/3 animate-pulse" />
              <div className="absolute w-20 h-20 rounded-full dark:bg-white/4 bg-black/4 animate-pulse [animation-delay:0.4s]" />
              <div className="relative w-14 h-14 rounded-2xl glass-rgb flex items-center justify-center dark:text-white/50 text-studodarkblue/50">
                <RiAiGenerate size={26} />
              </div>
            </div>
            <p className="text-sm dark:text-white/35 text-studodarkblue/40 text-center leading-relaxed max-w-[180px]">
              {isDragging ? t("drop_here") : t("drag_or_click")}
            </p>
          </div>
        </div>
      </BasePopup>
    </PopupBackdrop>
  );
};

ExtendCoursePopup.displayName = "ExtendCoursePopup";
export default ExtendCoursePopup;
