export default function ProgressBar() {
    return(
        <div className={"w-full h-15 gap-2 flex flex-col"}>
            <div className={"w-full flex items-center justify-between"}>
                <span>index</span>
                <span>length</span>
            </div>
            <div className={"w-full bg-studogrey/30 shadow-2xl overflow-hidden flex flex-row items-center justify-baseline h-3 rounded-full border border-gray-300 dark:border-studoborder/30"}>
                <div className={"w-1/2 h-full rounded-full bg-linear-90 bg-emerald-400 dark:from-bg-studoblue dark:to-blue-400"}/>
            </div>
        </div>
    )
}