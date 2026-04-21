import {ReactNode} from "react";
import FileHeader from "@/components/ui/app/your-files/header";
import PageContainer from "@/components/ui/design_system/page/PageContainer";


export default function Layout({ children }: { children: ReactNode }) {
    return (
        <PageContainer>
            <section className="w-full h-full flex flex-col overflow-hidden">
                <FileHeader/>
                <div className="flex-1 h-full overflow-y-hidden overflow-x-visible">{children}</div>
            </section>
        </PageContainer>
    );
}