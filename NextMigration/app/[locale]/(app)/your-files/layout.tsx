import {ReactNode} from "react";
import FileHeader from "@/components/app/your-files/header";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className=" w-full h-full py-15 pr-30 flex flex-col gap-10 scroll-hidden">
            <section className={"w-full h-fit"}>
                <FileHeader/>
                    <div>{children}</div>
            </section>
        </div>
    );
}