"use client"
import {FlowCourseResponse, FlowResourceResponse, FlowRowResponse, FullFlowCourseResponse} from "@studo/types";
import {useTranslations} from "next-intl";
import CourseItemProgress from "@/components/app/flow/page/overview/CourseItemProgress";
import {useState} from "react";
import {IoIosAdd} from "react-icons/io";
import CourseRow from "@/components/app/flow/page/CoursePage/overview_types/table/CourseRow";

interface CourseTableProps {
    data: FullFlowCourseResponse;
}

const CourseTable = (props: CourseTableProps) => {
    const {data} = props;
    //methods
    const createEmptyRow = (): FlowRowResponse => ({
        id: crypto.randomUUID(),
        course_id: data.board_id,
        title: "",
        description: "",
        priority: "",
        course_link: "",
        summary_link: "",
        status: "to_do",
        due_date: "",
        studoset_id: "",
        visualset_id: "string",
        resources: []
    });

    //states
    const [rows, setRows] = useState<FlowRowResponse[]>(
        data.rows.length > 0 ? data.rows : [createEmptyRow()]
    );
    const totalLength = rows.length;
    const done = rows.filter(r => r.status === "done").length;
    const progress = rows.filter(r => r.status === "in_progress").length;
    const containsRes = rows.some((row: FlowRowResponse) => row.resources.length > 0);
    const t = useTranslations("flow.course.row")


    const addRow = () => {
        setRows(prev => [...prev, createEmptyRow() ]);
    }




    const updateRow = async (index: number, updates: Partial<FlowRowResponse>) => {
        setRows(prev => prev.map((row, i) =>
            i === index ? { ...row, ...updates } : row
        ));

        // optimistic update: state is al aangepast, nu naar API
        await fetch(`/api/flow/rows/${rows[index].id}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        });
    };

    return (<div className={"w-full flex flex-col gap-7"}>
        <div className={"flex flex-row gap-3 items-center"}>
            <CourseItemProgress
                total_length={totalLength}
                total_in_progress={progress}
                total_done={done}
            />
            <span className={"flex flex-row truncate text-sm min-w-fit gap-2 text-studodarkblue font-bold dark:text-white"}>
                {done + " / " + totalLength} {t("done")}
            </span>
        </div>
        <div>
            <div style={{gridTemplateColumns: containsRes ? "3% 12% 49% 20% 12% 4%" : "3% 12% 69% 12% 4%"}}
                 className={"grid items-center text-xs font-bold border-b border-studoborder/30 h-7  text-studodarkblue/50 dark:text-white/50"}>
                <div className={"h-full"}></div>
                <span className={"px-2 h-full flex items-center border-x border-x-studoborder/30"}>status</span>
                <span className={"px-2 h-full flex items-center border-r border-r-studoborder/30"}>description</span>
                {containsRes && <span className={"px-2 h-full flex items-center border-x border-x-studoborder/30"}>resources</span>}
                <span className={"px-2 h-full flex items-center border-r border-r-studoborder/30"}>type</span>
                <div className={"h-full"}></div>
            </div>
            <div>
                {rows.map((row, i) => <CourseRow key={i} data={row} containsRes={containsRes} onChange={(updates) => updateRow(i, updates)} />)}
            </div>
            <div className={"flex flex-row justify-end"}>
                <button
                    type="button"
                    onClick={addRow}
                    className={"w-fit cursor-pointer items-center text-studodarkblue/50 dark:text-white/30 flex flex-row gap-2 border border-transparent hover:border-studoborder/30 rounded-full hover:bg-studogrey/30 transition-all duration-300 mt-1 px-5 h-7"}>
                    <IoIosAdd size={20}/>
                    <span>{t("cta_add_t")}</span>
                </button>
            </div>
        </div>
    </div>)
}

CourseTable.displayName = "CourseTable"
export default CourseTable