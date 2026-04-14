"use client"
import InputField from "@/components/design_system/input/InputField";
import {SetStateAction, useState} from "react";
import {useTranslations} from "next-intl";
import {FlowBoardResponse} from "@studo/types";
import {IoIosCloudOutline} from "react-icons/io";
import {getFlowIcon} from "@/components/design_system/icons/iconRegistry";
import {Link} from "@/i18n/routing";
import FlowBoardContext, {useFlowBoard} from "@/components/context/FlowBoardContext";
import CreateFlowBoard from "@/components/app/flow/overview/CreateFlowBoard";
import CreateFlowCourse from "@/components/app/flow/page/layout/CreateFlowCourse";

interface FlowBoardHeaderProps {
    data: FlowBoardResponse;
}

const FlowBoardOverviewHeader = (props: FlowBoardHeaderProps) => {
    const t = useTranslations("flow")
    const {data} = props;
    const [pageTitle, setPageTitle] = useState<string>(data.title);
    const [date, setDate] = useState<string>(data.year!);
    const [sem, setSem] = useState<string>(data.semester!);
    const {Icon, color} = getFlowIcon(data.icon);

    return (<div className="flex flex-col w-full gap-5">
        <div className={"w-full flex gap-3 justify-between items-center"}>
            <Link href={"/flow"}
                  className={`bg-${color}-400/20 text-${color}-500 min-w-12 min-h-12 rounded-xl flex items-center justify-center`}>
                <Icon size={25}/>
            </Link>
            <div className={"w-full flex flex-col justify-center items-baseline"}>
                <div className={"w-fit flex flex-row gap-5 items-center dark:text-white text-studodarkblue"}>
                    <InputField
                        placeholder={t("set_title")}
                        setValue={setPageTitle}
                        initialValue={pageTitle}
                        fontBold
                        textSize={"2xl"}
                    />
                    <IoIosCloudOutline/>
                </div>
                <div className={"flex flex-row gap-1 opacity-30 dark:text-white text-studodarkblue"}>
                    <InputField
                        placeholder={t("set_year")}
                        setValue={setDate}
                        initialValue={date}
                        textSize={"sm"}

                    />

                    <span>•</span>

                    <InputField
                        placeholder={t("set_semester")}
                        setValue={setSem}
                        initialValue={sem}
                        textSize={"sm"}
                    />
                    <span>•</span>
                    <span className={" w-fit p-0 items-center flex text-sm justify-center"}>
                       {data.courses.length} {data.courses.length === 1 ? t("course_1") : t("courses")}
                    </span>
                </div>
            </div>
        </div>
        <hr className="w-full border-0.5 border-studoborder/30" />
    </div>)
}

FlowBoardOverviewHeader.displayName = "FlowBoardOverviewHeader"
export default FlowBoardOverviewHeader;