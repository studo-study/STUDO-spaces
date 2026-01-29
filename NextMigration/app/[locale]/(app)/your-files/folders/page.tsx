import {Metadata} from "next";
import FolderTopBar from "@/components/app/your-files/folders/top-bar";
import FolderGrid from "@/components/app/your-files/folders/foldergrid";

export const metadata:Metadata = {
    title:"Folders | Studo"
}

export default function Page() {
    return (
        <div className=" w-full flex flex-col gap-10 scroll-hidden">
            <section className={"w-full h-fit"}>
                <FolderTopBar/>
               <FolderGrid/>

            </section>
        </div>
    );
}