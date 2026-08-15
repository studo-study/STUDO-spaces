"use client";
import PopupBackdrop from "@studo/ui/design_system/popup/PopupBackdrop";
import BasePopup from "@studo/ui/design_system/popup/BasePopup";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { IoArrowBack } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

interface PauseModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  back: () => void;
}
const PauseModal = ({ isOpen, setIsOpen, back }: PauseModalProps) => {
  const PopUpRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("speedy");
  return (
    <PopupBackdrop isOpen={isOpen} setIsOpen={setIsOpen} blur>
      <BasePopup isOpen={isOpen} popupRef={PopUpRef} height={"fit"}>
        <div
          className={
            "w-full h-full flex flex-col gap-10 p-5 items-center justify-between py-10 font-sfpro dark:text-white text-studodarkblue"
          }
        >
          <div className={"flex flex-col gap-3 items-center"}>
            <span className={"text-2xl font-bold "}>{t("pause_title")}</span>
          </div>
          <div
            className={"w-full flex flex-row gap-3 items-center justify-center"}
          >
            <BaseButton
              type={"button"}
              variant={"submit"}
              label={t("return")}
              iconLeft={<IoArrowBack />}
              onClick={back}
            />
            <BaseButton
              type={"button"}
              variant={"primary"}
              label={t("continue")}
              iconLeft={<FaRegClock />}
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      </BasePopup>
    </PopupBackdrop>
  );
};

PauseModal.displayName = "PauseModal";
export default PauseModal;
