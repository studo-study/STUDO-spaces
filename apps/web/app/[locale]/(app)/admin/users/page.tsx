import {Metadata} from "next";
import {useTranslations} from "next-intl";
export const metadata:Metadata = {
    title:"Admin Dashboard | Studo"
}

export default function UsersPage() {
    const t = useTranslations("admin")
    return(<div className={"w-full h-full flex flex-col gap-5"}>

    </div>);
}