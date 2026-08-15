"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import BasePopup from "@studo/ui/design_system/popup/BasePopup";
import PopupBackdrop from "@studo/ui/design_system/popup/PopupBackdrop";
import InputField from "@studo/ui/design_system/input/InputField";
import IconPicker from "@/components/ui/app/private/course/layout/IconPicker";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import TagSelector from "@studo/ui/design_system/tag/TagSelector";
import { useRouter } from "next/navigation";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import { FaChevronRight } from "react-icons/fa";
import IconButton from "@studo/ui/design_system/button/IconButton";
import { IoClose } from "react-icons/io5";
import TextArea from "@studo/ui/design_system/input/TextArea";
import { FiMinus } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { CalendarCheck, Link, Presentation } from "lucide-react";
import { useCreateCourse } from "@/hooks/app/courses/useCreateCourse";
import { useToast } from "@/components/providers/app/ToastProvider";
import BaseTooltip from "@studo/ui/design_system/tooltip/BaseToolTip";

const DEFAULT_ICON = "blue:bookopen";

interface CreateCourseProps {
  createOpen: boolean;
  setCreateOpen: (open: boolean) => void;
  board_title?: string;
  board_id?: string;
  noRedirect?: boolean;
}

const CreateCourse = (props: CreateCourseProps) => {
  const {
    createOpen,
    setCreateOpen,
    board_title,
    board_id,
    noRedirect = false,
  } = props;
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  //states
  const [selectedIcon, setSelectedIcon] = useState<string>(DEFAULT_ICON);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [examDate, setExamDate] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const [days, setDays] = useState<string[]>([]);
  const t = useTranslations("flow.course");
  const { mutateAsync: createCourse } = useCreateCourse();

  //helper functions
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setExamDate("");
    setLink("");
    setDays([]);
    setSelectedIcon(DEFAULT_ICON);
    setErrors({});
  };

  const onClose = () => {
    resetForm();
    setCreateOpen(false);
  };

  //useEffects
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        resetForm();
        setCreateOpen(false);
      }
    };

    if (createOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [createOpen, setCreateOpen, popupRef]);

  useEffect(() => {
    if (createOpen) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [createOpen]);

  //validate data
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) toast.error(t("error_title_required"));
    if (!selectedIcon) toast.error(t("error_icon_required"));

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //submit metadata
  const onShowMetadata = () => {
    setShowMetadata((prev) => !prev);
  };

  //submit
  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const data = await createCourse({
      title,
      icon: selectedIcon,
      description,
      examDate,
      boardId: board_id ?? undefined,
      resource: link,
      lessonDays: days.join("-"),
    });

    if (!noRedirect) router.push("/course/" + data.id);
    onClose();
  };

  useKeyboardShortcut("n", () => setCreateOpen(true));
  useKeyboardShortcut(
    "Escape",
    () => {
      setCreateOpen(false);
      if (inputRef.current) inputRef.current.value = "";
    },
    { always: true },
  );
  return (
    <PopupBackdrop isOpen={createOpen} setIsOpen={setCreateOpen}>
      <BasePopup
        width={"1/3"}
        height={"fit"}
        isOpen={createOpen}
        popupRef={popupRef}
        className={"p-0"}
      >
        <div className="w-full gap-1 dark:text-blue-400 text-emerald-400 absolute top-2 left-2 flex flex-row items-center">
          {board_title ? (
            <div>
              <span
                className={
                  "text-xs px-3 py-1 border border-studoborder/30 rounded-xl bg-studogrey/50 font-bold text-studodarkblue dark:text-white"
                }
              >
                {""}
                {board_title}
              </span>
              <FaChevronRight size={12} />
              <span
                className={
                  "text-xs px-3 py-1 border border-studoborder/30 rounded-xl bg-studogrey/50 font-bold text-studodarkblue dark:text-white"
                }
              >
                {" "}
                {t("create_title")}
              </span>
            </div>
          ) : (
            <span
              className={
                "text-xs px-3 py-1 border border-studoborder/30 rounded-xl bg-studogrey/50 font-bold text-studodarkblue dark:text-white"
              }
            >
              {t("create_course")}
            </span>
          )}
        </div>

        <div className={"w-fit absolute top-2 right-2 flex flex-row gap-2"}>
          <IconButton
            onSubmit={onClose}
            bg={"hover:bg-studogrey/20"}
            icon={<IoClose size={15} />}
          />
        </div>
        <div className={"mi-w-full flex flex-col gap-2 pt-12 px-7"}>
          <IconPicker
            course
            value={selectedIcon}
            onChange={(val) => setSelectedIcon(val)}
          />
          <InputField
            placeholder={t("add_title")}
            fontBold
            value={title}
            setValue={setTitle}
            textSize={"lg"}
            error={!title ? errors.title : undefined}
            ref={inputRef}
            width={"full"}
          />
          <TextArea
            placeholder={t("description")}
            textSize={"sm"}
            value={description}
            setValue={setDescription}
          />
          {showMetadata && (
            <div>
              <div
                className={
                  "relative z-99999 w-full flex flex-row gap-2 pt-5 scroll-hidden"
                }
              >
                <BaseTooltip content={t("add_course_link")}>
                  <TagSelector
                    icon={<Link size={16} />}
                    value={link}
                    onChange={setLink}
                    freeInput
                    link
                    placeholder={t("add_link")}
                  />
                </BaseTooltip>

                <BaseTooltip content={t("add_exam_date")}>
                  <TagSelector
                    icon={<CalendarCheck size={16} />}
                    value={examDate}
                    datePicker
                    onChange={setExamDate}
                  />
                </BaseTooltip>

                <BaseTooltip content={t("add_lesson_day")}>
                  <TagSelector
                    icon={<Presentation size={16} />}
                    options={[
                      { value: "1", label: "Monday" },
                      { value: "2", label: "Tuesday" },
                      { value: "3", label: "Wednesday" },
                      { value: "4", label: "Thursday" },
                      { value: "5", label: "Friday" },
                    ]}
                    value={days}
                    onChange={setDays}
                    multiple
                  />
                </BaseTooltip>
              </div>
            </div>
          )}
        </div>
        <hr
          className={
            "mt-5 w-full border border-transparent  border-b-studoborder/30"
          }
        />
        <div className={"w-full flex flex-row justify-end gap-2 px-3 py-3"}>
          <BaseButton
            size={"sm"}
            iconLeft={showMetadata ? <FiMinus /> : <IoIosAdd size={20} />}
            onSubmit={onShowMetadata}
            bg={"bg-transparent border-transparent"}
            label={showMetadata ? t("add_later") : t("add_metadata")}
          />

          <BaseButton
            size={"sm"}
            onSubmit={onSubmit}
            bg={"bg-blue-500"}
            label={t("create_btn")}
          />
        </div>
      </BasePopup>
    </PopupBackdrop>
  );
};

CreateCourse.displayName = "CreateCourse";
export default CreateCourse;
