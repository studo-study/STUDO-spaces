import BaseToolTip from "@/components/design_system/tooltip/BaseToolTip";

const FlowProgress = () => {
    return (<div
        className={"relative w-full flex flex-row min-h-full h-full px-2 gap-3 text-sm items-center justify-center dark:text-white text-studodarkblue"}>
        <div
            className=" w-full h-2 rounded-full bg-studogrey/30 border border-studoborder/30 flex flex-row">
            <BaseToolTip content="in progress" position="top">
                <div className="z-10 w-3/20 h-full bg-blue-500 rounded-3xl"/>
            </BaseToolTip>
            <BaseToolTip content="done" position="top">
                <div className="z-20 w-1/20 h-full bg-emerald-400 rounded-3xl"/>
            </BaseToolTip>
        </div>
        <div className={"min-w-fit flex flex-row gap-1 truncate"}>
            <span className={"bg-studogrey/30 rounded-3xl px-2"}>125 / 592</span>
            done
        </div>
    </div>)
}

FlowProgress.displayName = "FlowProgress";
export default FlowProgress;