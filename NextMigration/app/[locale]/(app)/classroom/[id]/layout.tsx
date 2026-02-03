import {useTranslations} from "next-intl";
import FileHeader from "@/components/app/your-files/header";
import {ReactNode} from "react";
import ClassroomHeader from "@/components/app/classroom/ClassroomHeader";


export default function ClassroomLayout({ children }: { children: ReactNode }) {
    const t = useTranslations("classroom")

    return (
        <div className=" w-full min-h-full h-full py-15 flex flex-col gap-10 scroll-hidden">
            <section className={"w-full h-fit"}>
                <ClassroomHeader/>
                <div className={"w-full min-h-full h-full"}>{children}</div>
            </section>
        </div>
    );


}