import {useTranslations} from "next-intl";

interface SmallBoardProgressProps {
    total_in_progress: number;
    total_length: number;
    total_done: number;
}

const SmallBoardProgress = (props: SmallBoardProgressProps) => {
    const {total_length, total_done, total_in_progress} = props;
    const donePercent = Number(total_length) > 0 ? (Number(total_done) / Number(total_length)) * 100 : 0;
    const progPercent = Number(total_length) > 0 ? (Number(total_in_progress) / Number(total_length)) * 100 : 0;

    return (<div className="flex flex-row gap-2 w-full items-center justify-between">
        <div
            className="relative w-full h-2 rounded-full bg-studogrey/30 border border-studoborder/30 flex flex-row">
            <div
                style={{width: `${progPercent}%`}}
                className={`absolute h-full transition-opacity bg-blue-500 rounded-3xl`}/>
            <div
                style={{width: `${donePercent}%`}}
                className={`asbolute h-full oopacity-0 transition-opacity bg-emerald-500 rounded-3xl`}/>

        </div>
        <span className={"min-w-fit truncate text-xs dark:text-white text-studodarkblue font-bold"}>{total_done} / {total_length}</span>
    </div>)
}

SmallBoardProgress.displayName = "SmallBoardProgress";
export default SmallBoardProgress;