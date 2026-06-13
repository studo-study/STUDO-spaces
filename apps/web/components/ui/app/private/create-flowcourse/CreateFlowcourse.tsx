"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import BasePopup from "@/components/ui/design_system/popup/BasePopup";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import InputField from "@/components/ui/design_system/input/InputField";
import IconPicker from "@/components/ui/app/private/flow/overview/IconPicker";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import IconButton from "@/components/ui/design_system/button/IconButton";
import { IoClose } from "react-icons/io5";
import { useCreateFlowcourse } from "@/hooks/app/flow/useCreateFlowcourse";

interface CreateFlowcourseProps {
  createOpen: boolean;
  setCreateOpen: (open: boolean) => void;
}

export default function CreateFlowcourse({
  createOpen,
  setCreateOpen,
}: CreateFlowcourseProps) {
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("flow.course");
  const { mutateAsync: createCourse } = useCreateFlowcourse();

  const [selectedIcon, setSelectedIcon] = useState("blue:bookopen");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onClose = useCallback(() => {
    setTitle("");
    setSelectedIcon("blue:bookopen");
    setErrors({});
    setCreateOpen(false);
  }, [setCreateOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (createOpen) {
      setTimeout(
        () => document.addEventListener("mousedown", handleClickOutside),
        0,
      );
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [createOpen, onClose]);

  useEffect(() => {
    if (createOpen) inputRef.current?.focus();
    else inputRef.current?.blur();
  }, [createOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = t("error_title_required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const data = await createCourse({ title, icon: selectedIcon });
    router.push(`/course/${data.id}`);
    onClose();
  };

  return (
    <PopupBackdrop isOpen={createOpen} setIsOpen={setCreateOpen}>
      <BasePopup
        width={"1/3"}
        height={"fit"}
        isOpen={createOpen}
        popupRef={popupRef}
        className={"p-0"}
      >
        <div className={"w-fit absolute top-2 right-2"}>
          <IconButton
            onSubmit={onClose}
            bg={"hover:bg-studogrey/20"}
            icon={<IoClose size={15} />}
          />
        </div>

        <div className={"w-full flex flex-col gap-2 pt-10 px-7 pb-2"}>
          <IconPicker course value={selectedIcon} onChange={setSelectedIcon} />
          <InputField
            placeholder={t("add_title")}
            fontBold
            value={title}
            setValue={setTitle}
            textSize={"lg"}
            error={!title ? errors.title : undefined}
            ref={inputRef}
          />
        </div>

        <hr
          className={
            "mt-5 w-full border border-transparent border-b-studoborder/30"
          }
        />

        <div className={"w-full flex flex-row justify-end gap-2 px-3 py-3"}>
          <BaseButton
            onSubmit={onSubmit}
            bg={"bg-blue-500"}
            label={t("create_btn")}
          />
        </div>
      </BasePopup>
    </PopupBackdrop>
  );
}
