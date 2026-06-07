"use client";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import BasePopup from "@/components/ui/design_system/popup/BasePopup";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { IoArrowBack } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

interface StartModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  back: () => void;
}
const StartModal = ({ isOpen, setIsOpen, back }: StartModalProps) => {
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
            <span className={"text-2xl font-bold "}>{t("modal_title")}</span>
            <p className={"whitespace-break-spaces opacity-75 text-center"}>
              {t("modal_expl")}
            </p>
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
              label={t("start")}
              iconLeft={<FaRegClock />}
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      </BasePopup>
    </PopupBackdrop>
  );
};

StartModal.displayName = "StartModal";
export default StartModal;
