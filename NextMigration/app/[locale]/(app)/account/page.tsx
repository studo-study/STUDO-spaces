import {Metadata} from "next";
import AccountHeader from "@/components/app/account/header";
import Stats from "@/components/app/account/stats";
import AccountGrid from "@/components/app/account/grid";


export const metadata:Metadata = {
    title:"Account | Studo"
}

export default function Page() {
    return (<div className={"w-full px-50 flex flex-col gap-10 py-20 scroll-hidden"}>
        <AccountHeader/>
        <Stats/>
        <AccountGrid/>
    </div>);
}