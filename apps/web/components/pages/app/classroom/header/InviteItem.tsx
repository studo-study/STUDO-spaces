import {IoIosClose} from "react-icons/io";

export default function InviteItem() {
    return (<div className={"w-full h-15 rounded-4xl bg-studogrey/30 text-studodarkblue dark:text-white border border-studoborder/30 flex px-3 pl-2 justify-between items-center"}>
        <div className={"w-1/2 h-15 flex items-center gap-3"}>
            <div className={"w-10 h-10 rounded-full bg-studogrey"}></div>
            <span>username</span>
        </div>
        <div className={"h-8 w-8 rounded-full hover:bg-studogrey text-3xl transition-all duration-300 justify-center items-center cursor-pointer active:scale-95 flex"}>
            <IoIosClose/>
        </div>
    </div>)
}