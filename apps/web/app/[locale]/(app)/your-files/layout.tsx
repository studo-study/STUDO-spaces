import {ReactNode} from "react";
import FileHeader from "@/components/ui/app/your-files/header";
import PageContainer from "@/components/ui/design_system/page/PageContainer";


export default function Layout({ children }: { children: ReactNode }) {
    return (
            <section className="w-full h-full flex flex-col scroll-hidden">
                <FileHeader/>
                <div className="flex-1 h-full">{children}</div>
            </section>
    );
}