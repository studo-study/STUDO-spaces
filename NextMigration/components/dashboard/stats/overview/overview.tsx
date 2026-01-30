interface QuickstatsProps {
    t: any;
}

export default function Overview({t}: QuickstatsProps) {
    return (<div className={"w-full h-full grid grid-rows-2 grid-cols-3 gap-5"}>
            <div className={"col-span-2 row-span-1 w-full h-full rounded-4xl dark:bg-studogrey/30 bg-studogrey border dark:border-studoborder border-studodarkblue/20 p-5 flex flex-col gap-1"}></div>
            <div className={"col-start-3 row-span-2 w-full h-full rounded-4xl dark:bg-studogrey/30 bg-studogrey border dark:border-studoborder border-studodarkblue/20 p-5 flex flex-col gap-1"}></div>
            <div className={"col-start-1 row-start-2 w-full h-full rounded-4xl dark:bg-studogrey/30 bg-studogrey border dark:border-studoborder border-studodarkblue/20 p-5 flex flex-col gap-1"}></div>
             <div className={"col-start-2 row-start-2 w-full h-full rounded-4xl dark:bg-studogrey/30 bg-studogrey border dark:border-studoborder border-studodarkblue/20 p-5 flex flex-col gap-1"}></div>
    </div>)
}