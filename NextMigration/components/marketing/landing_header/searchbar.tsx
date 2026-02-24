"use client"
import {useParams} from "next/navigation";
import {IoMdSearch} from "react-icons/io";

export default function Searchbar() {
    const url = useParams()
    return (<div className={` flex md:hidden lg:flex lg:min-w-1/10 lg:max-w-2/3 xl:min-w-1/2 xl:w-full  px-5 h-10 rounded-full bg-studogrey/30 dark:text-white text-studodarkblue border flex-row  items-center border-studoborder/30`}>
        <input type="text" placeholder={"search..."} className={"w-full h-full text-base focus:border-none outline-none"}/>
        <IoMdSearch className="text-2xl cursor-pointer active:scale-95 transition-all duration-200" />
    </div>)
}