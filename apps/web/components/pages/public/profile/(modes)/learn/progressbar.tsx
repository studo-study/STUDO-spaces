interface ProgressBarProps {
    cardIndex: number;
    cardLength: number;
    queueMode: boolean;
    queueIndex: number;
    queueLength: number;

}
export default function ProgressBar({cardIndex, cardLength, queueMode, queueLength, queueIndex}: ProgressBarProps) {
    const index = queueMode ? queueIndex : cardIndex;
    const length = queueMode ? queueLength: cardLength;
    const perc = length > 0 ? Math.floor(((index+1) / length) * 100) : 0;
    console.log(perc);
    return(
        <div className={"w-full h-15 gap-2 flex flex-col"}>
            <div className={"w-full flex items-center justify-between"}>
                <span>{queueMode ? queueIndex + 1 : index + 1}</span>
                <span>{queueMode ? queueLength : cardLength}</span>
            </div>

                <div className={"w-full bg-studogrey/30 shadow-2xl overflow-hidden flex flex-row items-center justify-baseline h-3 rounded-full border border-gray-300 dark:border-studoborder/30"}>
                    <div
                        style={{ width: `${perc}%` }}
                        animate={{ width: `${perc}%` }}
                        transition={{ duration: 0.3 }}
                        className={` h-full rounded-full bg-linear-90 ${queueMode ? "from-rose-300 to-rose-500" : "from-emerald-300 to-emerald-500 dark:from-bg-studoblue dark:to-blue-400"}`}/>
                </div>
        </div>
    )
}