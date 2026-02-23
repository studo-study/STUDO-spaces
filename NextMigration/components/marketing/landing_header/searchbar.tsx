"use client"
import {useParams} from "next/navigation";
import {IoMdSearch} from "react-icons/io";

export default function Searchbar() {
    const url = useParams()
    return (<div className={` min-w-100 h-10 rounded-full bg-studogrey border border-studoborder`}>
        <input type="text" placeholder={"search..."} className={"w-full h-full text-xl focus:border-none outline-none"}/>
        <IoMdSearch className="text-2xl cursor-pointer active:scale-95 transition-all duration-200" />
    </div>)
}