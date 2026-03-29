import {HiSpeakerphone} from "react-icons/hi";
import {SlOptions} from "react-icons/sl";

export default function LearnCard() {
    return(<div className={"w-full h-130 rounded-4xl border border-gray-300 dark:border-studoborder/30 bg-studogrey/30 shadow-xl p-5 gap-5 flex flex-col justify-between items-center"}>
        <div className={'w-full min-h-12 gap-2 rounded-2xl flex flex-row items-center'}>
            <div className={'w-full h-12 dark:text-white bg-studogrey/20 shadow-xl  cursor-pointer rounded-full flex  items-center px-5'}>
                Definitie
            </div>
            <div className={'min-w-12 h-12 dark:text-white cursor-pointer rounded-full shadow-xl border border-studoborder/30 bg-studogrey/30 flex  items-center justify-center'}>
                <HiSpeakerphone />
            </div>
            <div className={'min-w-12 h-12 dark:text-white cursor-pointer rounded-full shadow-xl border border-studoborder/30 bg-studogrey/30 flex  items-center justify-center'}>
                <SlOptions />
            </div>
        </div>
        <div className={'w-full h-full flex flex-row gap-5'}>
            <div className={'w-2/3 h-full rounded-2xl bg-gray-300/20 dark:bg-studogrey/20 p-5'}>
                term of definitie
            </div>
            <div className={'w-1/3 h-full rounded-2xl bg-gray-300/20 dark:bg-studogrey/20 p-5'}>
            </div>
        </div>
        <div className={'min-h-20 w-full flex flex-col gap-2'}>
            <div className={"w-full font-bold flex justify-end gap-5 px-5"}>
                <button className={"hover:text-gray-300 cursor-pointer"}>hint</button>
                <button className={"hover:text-gray-300 cursor-pointer"}>ik weet het niet</button>
            </div>
            <div className={"bg-gray-300/20 group group-active:border border-gray-700 dark:bg-studogrey/20 px-5  flex items-center rounded-2xl w-full h-full"}>
                <input type="text" placeholder={""} className={"w-full group h-full outline-none"}/>
            </div>
        </div>
    </div>
    )
}