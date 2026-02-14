import Image from "next/image";
import {FullClassroom, FullClassroomSet, FullStudyset} from "@/types/types";
import {usePathname} from "next/navigation";
import {useUser} from "@/components/providers/UserProvider";

interface setItemProps {
    set: FullStudyset;
    importedClassrooms: FullClassroomSet[];
}
export default function SetItem({set, importedClassrooms}: setItemProps) {
    const iconSrc = set.cards ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const path = usePathname();
    const currentUser = useUser().user?.id ?? "user";
    const currentSet = {
        title: set.title,
        course: set.course,
        owner: set.user_id,
        created_at: set.created_at,
        set_id: set.id,
        set_type: set.cards ? "studoset":"visualset",
        classroom_id: path,
        added_by: currentUser,
    }

    const addToImported = () => {
        if (importedClassrooms.includes(currentSet)) {
            importedClassrooms.pop(currentSet)
        }
        else {
            importedClassrooms.push(currentSet)
        }
    }
    return(<div className={"w-full h-15 rounded-full bg-studogrey/30 flex flex-row items-center justify-between px-2.5 pr-5"}>
            <div className={"w-fit h-fit flex items-center gap-3"}>
                <div className={"rounded-full h-10 w-10 bg-studogrey/30"}></div>
                <Image src={iconSrc} width={0} height={0} className="invert opacity-50 brightness-0 w-5 flex-shrink-0" alt="" />
                <span className={"dark:text-white text-studodarkblue w-3/5 truncate overflow-hidden"}>{set.title}</span>
            </div>
        <div className={"w-fit h-fit items-center flex"}>
            <input
                onChange={addToImported}
                type="checkbox"
                className="h-6 w-6 appearance-none rounded-full border-2 border-gray-300
    checked:bg-studoblue checked:border-studoblue
    checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M9%2016.17L4.83%2012l-1.42%201.41L9%2019%2021%207l-1.41-1.41z%22%2F%3E%3C%2Fsvg%3E')]
    bg-center bg-no-repeat bg-[length:16px]
    transition duration-150 ease-in-out cursor-pointer"
            />
        </div>
    </div>)
}