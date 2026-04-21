import {useTranslations} from "next-intl";
import {ReactNode} from "react";
import ClassroomsHeader from "@/components/ui/app/classrooms/ClassroomsHeader";
import PageContainer from "@/components/ui/design_system/page/PageContainer";

export default function ClassroomsLayout({ children }: { children: ReactNode }) {
    const t = useTranslations("classroom")
    return (
        <PageContainer>
            <section className={"w-full h-fit"}>
                <ClassroomsHeader/>
                <div>{children}</div>
            </section>
        </PageContainer>
    );


}