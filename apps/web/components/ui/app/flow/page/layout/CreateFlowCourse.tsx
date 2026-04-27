"use client"
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import BasePopup from "@/components/ui/design_system/popup/BasePopup";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import InputField from "@/components/ui/design_system/input/InputField";
import IconPicker from "@/components/ui/app/flow/overview/IconPicker";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import TagSelector from "@/components/ui/design_system/tag/TagSelector";
import {LiaUniversitySolid} from "react-icons/lia";
import {MdOutlineCalendarViewMonth} from "react-icons/md";
import {HiCalendarDays} from "react-icons/hi2";
import {useRouter} from "next/navigation";
import {useFlowStore} from "@/store/slices/flow/flowStore";
import {useKeyboardShortcut} from "@/hooks/useKeyboardShortcut";
import {FaChevronRight} from "react-icons/fa";
import {CgArrowsExpandRight} from "react-icons/cg";
import IconButton from "@/components/ui/design_system/button/IconButton";
import {IoClose} from "react-icons/io5";
import TextArea from "@/components/ui/design_system/input/TextArea";
import {FiMinus} from "react-icons/fi";
import {IoIosAdd} from "react-icons/io";
import {LuLink} from "react-icons/lu";


interface CreateFlowBoardProps {
    createOpen: boolean;
    setCreateOpen: (open: boolean) => void;
    board_title: string;
    board_id: string;
}

const CreateFlowBoard = (props: CreateFlowBoardProps) => {
    const {createOpen, setCreateOpen, board_title, board_id} = props;
    const router = useRouter();
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    //states
    const [selectedIcon, setSelectedIcon] = useState<string>("blue:bookopen");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [examDate, setExamDate] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showMetadata, setShowMetadata] = useState<boolean>(false);
    const [days, setDays] = useState<string[]>([]);
    const t = useTranslations("flow.course")
    const {addCourse} = useFlowStore();

    //helper functions
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setExamDate("");
        setLink("");
        setSelectedIcon("emerald:default")
        setErrors({});
    };

    const onClose = () => {
        resetForm()
        setCreateOpen(false)
    }

    //useEffects
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node)
            ) {
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

    useEffect(() => {console.log(days.join('-'))}, [days])
    //validate data
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = t("error_title_required");
        if (!selectedIcon) newErrors.icon = t("error_icon_required");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //submit metadata
    const onShowMetadata = () => {
        setShowMetadata(prev => !prev);
    }

    //submit
    const onSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        console.log("icon", selectedIcon);
        if (!validate()) return;

        const body = {
            title: title,
            icon: selectedIcon,
            description: description,
            exam_date: examDate,
            board_id: board_id,
            resource: link,
            lesson_days: days.join('-')
        };

        console.log("body", body);

        const res = await fetch("/api/flows/course", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        });

        if (res.ok) {
            const data = await res.json();
            addCourse(data);
            router.push("/flow/" + board_id + "/" + data.id);
            onClose();
        }
    };

    useKeyboardShortcut("n", () => setCreateOpen(true));
    useKeyboardShortcut("Escape", () => {
        setCreateOpen(false);
        if(inputRef.current) inputRef.current.value = "";
    }, {always: true});
    return (<PopupBackdrop
        isOpen={createOpen}
        setIsOpen={setCreateOpen}
    >
        <BasePopup
            width={'1/3'}
            height={'fit'}
            isOpen={createOpen}
            popupRef={popupRef}
            className={"p-0"}
        >
           <div className="w-full gap-1 dark:text-blue-400 text-emerald-400 absolute top-2 left-2 flex flex-row items-center">
                <span
                    className={"text-xs px-3 py-1 border border-studoborder/30 rounded-xl bg-studogrey/50 font-bold text-studodarkblue dark:text-white"}> {board_title}</span>
               <FaChevronRight size={12}/>
                <span
                    className={"text-xs px-3 py-1 border border-studoborder/30 rounded-xl bg-studogrey/50 font-bold text-studodarkblue dark:text-white"}> {t("create_title")}</span>
           </div>
            <div className={"w-fit absolute top-2 right-2 flex flex-row gap-2"}>
                <IconButton
                    onSubmit={onClose}
                    bg={"hover:bg-studogrey/20"}
                    icon={ <IoClose size={15}/>}
                />
            </div>
            <div className={"w-full flex flex-col gap-2 pt-12 px-7"}>
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
                />
                    <TextArea
                        placeholder={t("description")}
                        textSize={"sm"}
                        value={description}
                        setValue={setDescription}
                    />
                {showMetadata && <div>
                    <div className={"w-full flex flex-row gap-2 pt-5 scroll-hidden"}>
                        <TagSelector
                            label="Link"
                            icon={<LuLink size={14}/>}
                            value={link}
                            onChange={setLink}
                            freeInput
                            link
                            placeholder={t("add_link")}
                        />

                        <TagSelector
                            label="Exam date"
                            icon={<HiCalendarDays size={14}/>}
                            value={examDate}
                            datePicker
                            onChange={setExamDate}
                        />


                        <TagSelector
                            label="Lesson day(s)"
                            icon={<HiCalendarDays size={14}/>}
                            options={[
                                {value: "1", label: "Monday"},
                                {value: "2", label: "Tuesday"},
                                {value: "3", label: "Wednesday"},
                                {value: "4", label: "Thursday"},
                                {value: "5", label: "Friday"},
                            ]}
                            value={days}
                            onChange={setDays}
                            multiple
                        />
                    </div>
                </div>}
            </div>
            <hr className={"mt-5 w-full border border-transparent  border-b-studoborder/30"}/>
            <div className={"w-full flex flex-row justify-end gap-2 px-3 py-3"}>
                <BaseButton
                    iconLeft={showMetadata ? <FiMinus />:  <IoIosAdd size={20} /> }
                    onSubmit={onShowMetadata}
                    bg={"bg-transparent border-transparent"}
                    label={showMetadata ? t("add_later") : t("add_metadata")}/>

                <BaseButton
                    onSubmit={onSubmit}
                    bg={"bg-blue-500"}
                    label={t("create_btn")}/>
            </div>
        </BasePopup>

    </PopupBackdrop>)
}

CreateFlowBoard.displayName = "CreateFlowBoard"
export default CreateFlowBoard