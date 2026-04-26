import {Metadata} from "next";
import AccountHeader from "@/components/ui/app/account/AccountHeader";
import Stats from "@/components/ui/app/account/AccountStats";
import AccountGrid from "@/components/ui/app/account/AccountGrid";

export const metadata:Metadata = {
    title:"Account | Studo"
}

export default function Page() {
    return (<>
        <AccountHeader/>
        <Stats/>
        <AccountGrid/>
    </>)
}