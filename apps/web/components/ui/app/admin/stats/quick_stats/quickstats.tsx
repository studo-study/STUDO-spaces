import {IoTrendingUpOutline} from "react-icons/io5";
import {IoIosRocket, IoIosTrendingDown} from "react-icons/io";
import {MdOutlineTrendingFlat} from "react-icons/md";
import {BiSolidPlaneAlt} from "react-icons/bi";

interface QuickstatsProps {
    t: any;
}
export default function QuickStats({t}: QuickstatsProps) {
    const TotalthisMonth = 70558;
    const TotallastMonth= 50204;
    const ActiveMonth = 25240;
    const ActiveLastMonth = 22003;

    return (<div className={"w-full grid grid-rows-1 grid-cols-4 gap-5"}>
        <div className={"w-full h-25 rounded-4xl dark:bg-studogrey/10 bg-studogrey border dark:border-studoborder/30 border-studodarkblue/20 p-5 flex flex-col gap-1"}>
            <span className={"w-full font-bold dark:text-white/50 text-sm text-studodarkblue/50 items-baseline flex gap-2 flex-row"}>{t("total_usr")} {perc(TotalthisMonth, TotallastMonth)}</span>
            <div>{checkTotalUsers(TotalthisMonth, TotallastMonth, t)}</div>
        </div>
        <div className={"w-full h-25 rounded-4xl dark:bg-studogrey/10 bg-studogrey border dark:border-studoborder/30 border-studodarkblue/20 p-5 flex flex-col gap-1"}>
            <span className={"w-full font-bold dark:text-white/50 text-sm text-studodarkblue/50 items-baseline flex gap-2 flex-row"}>{t("total_month")}: {perc(ActiveMonth, ActiveLastMonth)}</span>
            <div>{checkActiveUsers(ActiveMonth, ActiveLastMonth, t)}</div>
        </div>
        <div className={"w-full h-25 rounded-4xl dark:bg-studogrey/10 bg-studogrey border dark:border-studoborder/30 border-studodarkblue/20 p-5 flex flex-col gap-1"}>
            <span className={"w-full font-bold dark:text-white/50 text-sm text-studodarkblue/50"}>{t("total_ss")}:</span>
            <span className={"w-full font-bold dark:text-white text-studodarkblue text-xl"}>{refactor(593939)}</span>
        </div>
        <div className={"w-full h-25 rounded-4xl dark:bg-studogrey/10 bg-studogrey border dark:border-studoborder/30 border-studodarkblue/20 p-5 flex flex-col gap-1"}>
            <span className={"w-full font-bold dark:text-white/50 text-sm text-studodarkblue/50"}>{t("total_vs")}:</span>
            <span className={"w-full font-bold dark:text-white text-studodarkblue text-xl"}>{refactor(258383)}</span>
        </div>
    </div>)
}

function perc(number: number, lastMonth: number) {
    const difference = number - lastMonth;
    const perc = Math.floor((difference / lastMonth) * 10000) / 100;
    if(difference >= 0) return <span className={"text-xs dark:text-white/30 text-black/30 font-normal"}>(+ {perc} %)</span>
    return <span className={"text-xs dark:text-white/30 text-black/30"}>(- {perc}%)</span>
}

function checkTotalUsers(number: number, lastMonth: number, t: any) {
    const difference = number - lastMonth;
    const perc = Math.floor((difference / lastMonth) * 10000) / 100;
    if (difference >= lastMonth * 1.2 - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl text-emerald-500"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><IoIosRocket size={20} /><span className={"text-sm dark:text-white/50 text-black/50"}>(+ {refactor(difference.valueOf())} )</span></div>);
    if (difference >= lastMonth * 1.1 - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl text-emerald-500"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><BiSolidPlaneAlt size={20} /><span className={"text-sm dark:text-white/50 text-black/50"}>(+ {refactor(difference.valueOf())} )</span></div>);
    if (difference >= lastMonth * 1.05 - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl text-emerald-300"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><IoTrendingUpOutline size={35} /><span className={"text-sm dark:text-white/50 text-black/50"}>(+ {refactor(difference.valueOf())} )</span></div>);
    if (difference > lastMonth - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl dark:text-white text-studodarkblue"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><IoTrendingUpOutline size={35} /> <span className={"text-sm dark:text-white/50 text-black/50"}>(+ {refactor(difference.valueOf())} )</span></div>);
    if (difference === lastMonth - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl dark:text-white text-studodarkblue"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><span className={"text-sm dark:text-white/50 text-black/50"}>(+ {difference})</span></div>);
    if (difference < 0) return (<div className={"w-full flex flex-row items-center just gap-2 text-xl text-rose-500"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><IoIosTrendingDown size={35} /> <span className={"text-sm dark:text-white/50 text-black/50"}>(- {refactor(difference.valueOf())})</span></div>);
}

function checkActiveUsers(number: number, lastMonth: number, t: any) {
    const difference = number - lastMonth;
    const perc = Math.floor((difference / lastMonth) * 10000) / 100;
    if (difference >= lastMonth * 1.3 - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl text-emerald-500"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><IoIosRocket size={20} /><span className={"text-sm dark:text-white/50 text-black/50"}>(+ {refactor(difference.valueOf())} )</span></div>);
    if (difference >= lastMonth * 1.25 - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl text-emerald-500"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><BiSolidPlaneAlt size={20} /><span className={"text-sm dark:text-white/50 text-black/50"}>(+ {refactor(difference.valueOf())} )</span></div>);
    if (difference >= lastMonth * 1.1 - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl text-emerald-300"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><IoTrendingUpOutline size={35} /><span className={"text-sm dark:text-white/50 text-black/50"}>(+ {refactor(difference.valueOf())} )</span></div>);
    if (difference > lastMonth - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl dark:text-white text-studodarkblue"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><IoTrendingUpOutline size={35} /> <span className={"text-sm dark:text-white/50 text-black/50"}>(+ {refactor(difference.valueOf())} )</span></div>);
    if (difference === lastMonth - lastMonth) return (<div className={"w-full flex flex-row items-center gap-2 text-xl dark:text-white text-studodarkblue"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><span className={"text-sm dark:text-white/50 text-black/50"}>(+ {difference})</span></div>);
    if (difference < 0) return (<div className={"w-full flex flex-row items-center just gap-2 text-xl text-rose-500"}><span className={"w-fit font-bold dark:text-white text-studodarkblue"}>{refactor(number)}</span><IoIosTrendingDown size={35} /> <span className={"text-sm dark:text-white/50 text-black/50"}>(- {refactor(difference.valueOf())})</span></div>);
}


function refactor(number: number){
    const numberArray = number.toString().split('').reverse()
    for(let i = numberArray.length - 1; i > 0; i--){
        if (i % 3 === 0){
            numberArray[i] = numberArray[i] + ".";
        }
        else {
            numberArray[i] = numberArray[i];
        }
    }

    return numberArray.reverse().join('');
}