import {ReactNode} from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className=" w-full h-full py-15 pr-30 flex flex-col gap-10 scroll-hidden">
            <section className={"w-full h-fit"}>
                <div className={"w-full h-1 rounded-3xl bg-studogrey"}></div>
                <div>{children}</div>
            </section>
        </div>
    );
}