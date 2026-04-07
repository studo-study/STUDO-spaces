import {useTranslations} from "next-intl";
import FileHeader from "@/components/pages/app/your-files/header";
import {ReactNode} from "react";
import ClassroomHeader from "@/components/pages/app/classroom/PrivateClassroomHeader";

export default function Layout({ children }: { children: ReactNode }) {
    const t = useTranslations("classroom")
    return (
        <div className=" w-full h-full py-15 pr-30 flex flex-col gap-10 scroll-hidden">
            <section className={"w-full h-fit"}>
                <ClassroomHeader/>
                <div>{children}</div>
            </section>
        </div>
    );


}