
import {Metadata} from "next";
import {BsGridFill} from "react-icons/bs";
import {HiOutlineViewList} from "react-icons/hi";
import Grid from "@/components/app/your-files/sets/grid";

export const metadata:Metadata = {
    title:"Sets | Studo"
}

export default function SetsPage() {
    return(
        <div className="w-full h-full">
            <Grid/>
        </div>);
}