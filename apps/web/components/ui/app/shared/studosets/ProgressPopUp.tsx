"use client";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import BasePopup from "@/components/ui/design_system/popup/BasePopup";
import { SetStateAction, useRef, useState } from "react";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { Info } from "lucide-react";

interface ProgresssPopupProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}
const ProgressPopUp: React.FC<ProgresssPopupProps> = (props) => {
  const { isOpen, setIsOpen } = props;
  const popupRef = useRef<HTMLDivElement>(null);
  return (
    <PopupBackdrop isOpen={isOpen} setIsOpen={setIsOpen}>
      <BasePopup popupRef={popupRef} isOpen={isOpen}></BasePopup>
    </PopupBackdrop>
  );
};

ProgressPopUp.displayName = "ProgressPopUp";

const ProgressPopUpTrigger = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <BaseButton
        variant={"icon"}
        shape={"circle"}
        onClick={() => setIsOpen((prev) => !prev)}
        icon={<Info size={20} />}
      />
      <ProgressPopUp isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

ProgressPopUpTrigger.displayName = "ProgressPopUpTrigger";
export default ProgressPopUpTrigger;
