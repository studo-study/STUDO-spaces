import {Metadata} from "next";
import AccountHeader from "@/components/app/account/header";
import Stats from "@/components/app/account/stats";


export const metadata:Metadata = {
    title:"Account | Studo"
}

export default function Page() {
    return (<div className={"w-full px-50 flex flex-col gap-10 py-20"}>
        <AccountHeader/>
        <Stats/>
    </div>);
}