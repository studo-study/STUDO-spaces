import {useTranslations} from "next-intl";
import FileHeader from "@/components/app/your-files/header";
import {ReactNode} from "react";
import ClassroomHeader from "@/components/app/classroom/ClassroomHeader";

export default function ClassroomLayout({ children }: { children: ReactNode }) {
    return (
        <div className="w-full h-full py-15 flex flex-col overflow-hidden">
            <ClassroomHeader />
            <div className="w-full flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}