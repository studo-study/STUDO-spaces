"use client"
import {useTranslations} from "next-intl";

interface FlowProgressProps {
    total_in_progress: number;
    total_length: number;
    total_done: number;
}

const CourseItemProgress = (props: FlowProgressProps) => {
    const {total_in_progress, total_length, total_done} = props;
    const donePercent = Number(total_length) > 0 ? (Number(total_done) / Number(total_length)) * 100 : 0;
    const progPercent = Number(total_length) > 0 ? (Number(total_in_progress) / Number(total_length)) * 100 : 0;
    const t = useTranslations("flow.course.row")

    return (<div
        className={"relative w-full flex flex-col h-fit gap-3 text-sm items-center justify-center dark:text-white text-studodarkblue"}>
        <div className="relative w-full h-2 rounded-full bg-studogrey/30 border border-studoborder/30 flex flex-row">
            <div
                style={{width: `${progPercent + donePercent}%`}}
                className={`absolute z-30 h-full cursor-pointer transition-[width] duration-300 ease-in-out bg-linear-90 from-amber-600 to-amber-400 rounded-3xl`}/>
            <div
                style={{width: `${donePercent}%`}}
                className={`absolute z-100 h-full cursor-pointer transition-[width] duration-300 border border-studoborder/30 ease-in-out bg-linear-90 from-emerald-500 to-emerald-400 rounded-3xl`}/>
        </div>
    </div>)
}

CourseItemProgress.displayName = "CourseItemProgress";
export default CourseItemProgress;