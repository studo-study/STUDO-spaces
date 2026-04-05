import {useTranslations} from "next-intl";
import {ReactNode} from "react";
import ClassroomsHeader from "@/components/app/classrooms/ClassroomsHeader";

export default function ClassroomsLayout({ children }: { children: ReactNode }) {
    const t = useTranslations("classroom")
    return (
        <div className=" w-full h-full py-15 flex flex-col gap-10 scroll-hidden">
            <section className={"w-full h-fit"}>
                <ClassroomsHeader/>
                <div>{children}</div>
            </section>
        </div>
    );


}