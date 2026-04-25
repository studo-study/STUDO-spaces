import {useTranslations} from "next-intl";
import {ReactNode} from "react";
import ClassroomsHeader from "@/components/ui/app/classrooms/ClassroomsHeader";

export default function ClassroomsLayout({ children }: { children: ReactNode }) {
    const t = useTranslations("classroom")
    return (
        <>
            <section className={"w-full h-fit"}>
                <ClassroomsHeader/>
                <div>{children}</div>
            </section>
        </>
    );


}