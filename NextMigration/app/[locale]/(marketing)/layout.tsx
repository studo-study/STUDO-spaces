import {ReactNode} from "react";
import LandingHeader from "@/components/landing_header/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
    return (<div className={""}>
        <LandingHeader/>
        <main>{children}</main>
    </div>);
}