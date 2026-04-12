"use client"
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import BasePopup from "@/components/design_system/popup/BasePopup";
import PopupBackdrop from "@/components/design_system/popup/PopupBackdrop";
import InputField from "@/components/design_system/input/InputField";
import IconPicker from "@/components/app/flow/IconPicker";
import BaseButton from "@/components/design_system/button/BaseButton";
import TagSelector from "@/components/design_system/tag/TagSelector";
import {LiaUniversitySolid} from "react-icons/lia";
import { MdOutlineCalendarViewMonth } from "react-icons/md";
import {HiCalendarDays} from "react-icons/hi2";
import {useRouter} from "next/navigation";
import {useFlowStore} from "@/store/flowStore";


interface CreateFlowBoardProps {
    createOpen: boolean;
    setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateFlowBoard = (props: CreateFlowBoardProps) => {
    const {createOpen, setCreateOpen} = props;
    const router = useRouter();
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    //states
    const [selectedIcon, setSelectedIcon] = useState<string>("emerald:default");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [school, setSchool] = useState<string>("");
    const [startYear, setStartYear] = useState<string>("");
    const [endYear, setEndYear] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const t = useTranslations("flow")
    const { addBoard } = useFlowStore();

    //helper functions
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setSchool("");
        setStartYear("");
        setEndYear("");
        setSemester("");
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

    //validate data
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = t("error_title_required");
        if (!startYear.trim()) newErrors.startYear = t("error_year_required");
        if (!endYear.trim()) newErrors.endYear = t("error_year_required");
        if (!selectedIcon) newErrors.icon = t("error_icon_required");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //submit
    const onSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        console.log("icon", selectedIcon);
        if (!validate()) return;

        const body = {
            title: title,
            icon: selectedIcon,
            description: description,
            year: startYear + " - " + endYear,
            semester: semester,
            school: school,
        };

        const res = await fetch("/api/flows", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            const data = await res.json();
            addBoard(data);
            onClose();
        }
    };

    return (<PopupBackdrop
        isOpen={createOpen}
        setIsOpen={setCreateOpen}
    >
        <BasePopup
            width={'1/3'}
            height={'f'}
            isOpen={createOpen}
            popupRef={popupRef}
            className={"p-0"}
        >
            <span
                className={"text-xs px-3 py-1 border border-studoborder/30 rounded-xl bg-studogrey/50 absolute top-2 left-2 font-bold text-studodarkblue dark:text-white"}>{t("create_title")}</span>
            <div className={"w-full flex flex-col gap-2 pt-12 px-7"}>
                <IconPicker
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
                <InputField
                    placeholder={t("description")}
                    textSize={"sm"}
                    value={description}
                    setValue={setDescription}
                />
                <div className={"w-full flex flex-row gap-2 pt-5 scroll-hidden"}>
                    <TagSelector
                        label="School"
                        icon={<LiaUniversitySolid size={14}/>}
                        value={school}
                        onChange={setSchool}
                        freeInput
                        placeholder="Typ je school..."
                    />

                    <TagSelector
                        label="Semester"
                        icon={<MdOutlineCalendarViewMonth size={14}/>}
                        options={[
                            { value: "1",     label: "Semester 1"},
                            { value: "2",        label: "Semester 2"},
                        ]}
                        value={semester}
                        onChange={setSemester}
                    />

                    <TagSelector
                        label="Start Year"
                        icon={<HiCalendarDays size={14} />}
                        value={startYear}
                        freeInput
                        onChange={setStartYear}
                        error={!startYear ? errors.startYear : undefined}
                    />

                    <TagSelector
                        label="End Year"
                        icon={<HiCalendarDays size={14} />}
                        value={endYear}
                        freeInput
                        onChange={setEndYear}
                        error={!endYear ? errors.endYear : undefined}
                    />
                </div>
            </div>
            <hr className={"mt-5 w-full border border-transparent  border-b-studoborder/30"}/>
            <div className={"w-full flex flex-row justify-between px-3 py-3"}>
                <BaseButton
                    onSubmit={onClose}
                    bg={"bg-studogrey/20"}
                    label={t("cancel_btn")}/>
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