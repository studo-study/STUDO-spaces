"use client"
import {useState} from "react";

interface FlowProgressProps {
    total_in_progress: string;
    total_length: string;
    total_done: string;
}

const CourseItemProgress = (props: FlowProgressProps) => {
    const {total_in_progress, total_length, total_done} = props;
    const [showsDone, setShowsDone] = useState<boolean>(true);
    const toggleProgress = (): void => {
        setShowsDone(!showsDone);
    }
    const donePercent = Number(total_length) > 0 ? (Number(total_done) / Number(total_length)) * 100 : 0;
    const progPercent = Number(total_length) > 0 ? (Number(total_in_progress) / Number(total_length)) * 100 : 0;

    return (<div
        className={"relative w-full flex flex-col h-fit px-2 gap-3 text-sm items-center justify-center dark:text-white text-studodarkblue"}>
        <div className="relative w-full h-2 rounded-full bg-studogrey/30 border border-studoborder/30 flex flex-row">
            <div
                style={{ width: `${progPercent}%` }}
                className={`absolute h-full ${!showsDone && "opacity-100"} opacity-0 transition-opacity bg-blue-500 rounded-3xl`}/>
            <div
                style={{ width: `${donePercent}%` }}
                className={`asbolute h-full ${showsDone && "opacity-100"} opacity-0 transition-opacity bg-emerald-500 rounded-3xl`}/>

        </div>
        <div className={"w-full flex cursor-pointer flex-row gap-1 truncate align-center justify-baseline"}>
            <span className={"bg-studogrey opacity-30 rounded-3xl px-2"}>{total_in_progress ? total_in_progress : 0} / {total_length ? total_length : 0} done</span>
        </div>
    </div>)
}

CourseItemProgress.displayName = "CourseItemProgress";
export default CourseItemProgress;