import {Metadata} from "next";
import AccountHeader from "@/components/ui/app/account/AccountHeader";
import Stats from "@/components/ui/app/account/AccountStats";
import AccountGrid from "@/components/ui/app/account/AccountGrid";


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