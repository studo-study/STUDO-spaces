import {ReactNode, useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import BasePopup from "@/components/design_system/popup/BasePopup";
import PopupBackdrop from "@/components/design_system/popup/PopupBackdrop";
import InputField from "@/components/design_system/input/InputField";
import IconPicker from "@/components/app/flow/IconPicker";
import BaseButton from "@/components/design_system/button/BaseButton";
import TagSelector from "@/components/design_system/tag/TagSelector";
import {FiFlag} from "react-icons/fi";

interface CreateFlowBoardProps {
    createOpen: boolean;
    setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateFlowBoard = (props: CreateFlowBoardProps) => {
    const {createOpen, setCreateOpen} = props;
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedIcon, setSelectedIon] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [priority, setPriority] = useState<string>("");
    const t = useTranslations("flow")
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node)
            ) {
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
                />
                <InputField
                    placeholder={t("add_title")}
                    fontBold
                    textSize={"lg"}
                />
                <InputField
                    placeholder={t("description")}
                    textSize={"sm"}
                />
                <div className={"w-full flex flex-row gap-2 pt-5"}>
                    <TagSelector
                        label="School"
                        options={[
                            { value: "backlog",     label: "Backlog",     dot: "bg-amber-400" },
                            { value: "to_do",       label: "To Do",       dot: "bg-neutral-400" },
                            { value: "in_progress", label: "In Progress", dot: "bg-blue-400" },
                            { value: "done",        label: "Done",        dot: "bg-emerald-400" },
                        ]}
                        value={status}
                        onChange={setStatus}
                    />

                    <TagSelector
                        label="Semester"
                        options={[
                            { value: "1",     label: "Semester 1",     dot: "bg-blue-400" },
                            { value: "2",        label: "Semester 2",        dot: "bg-emerald-400" },
                        ]}
                        value={status}
                        onChange={setStatus}
                    />

                    <TagSelector
                        label="Year"
                        icon={<FiFlag size={14} />}
                        options={[
                            { value: "no_priority", label: "No priority",  icon: <FiFlag size={14} /> },
                            { value: "low",         label: "Low",           icon: <FiFlag size={14} /> },
                            { value: "medium",      label: "Medium",        icon: <FiFlag size={14} /> },
                            { value: "high",        label: "High",          icon: <FiFlag size={14} /> },
                        ]}
                        value={priority}
                        onChange={setPriority}
                    />
                </div>
            </div>
            <hr className={"mt-5 w-full border border-transparent  border-b-studoborder/30"}/>
            <div className={"w-full flex flex-row justify-between px-3 py-3"}>
                <BaseButton
                    bg={"bg-studogrey/20"}
                    label={t("cancel_btn")}/>
                <BaseButton
                    bg={"bg-blue-500"}
                    label={t("create_btn")}/>
            </div>
        </BasePopup>

    </PopupBackdrop>)
}

CreateFlowBoard.displayName = "CreateFlowBoard"
export default CreateFlowBoard