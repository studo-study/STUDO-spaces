import {ReactNode} from "react";
import FileHeader from "@/components/app/your-files/header";


export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="w-full h-full py-15 flex flex-col gap-10">
            <section className="w-full h-full flex flex-col overflow-hidden">
                <FileHeader/>
                <div className="flex-1 overflow-hidden">{children}</div>
            </section>
        </div>
    );
}