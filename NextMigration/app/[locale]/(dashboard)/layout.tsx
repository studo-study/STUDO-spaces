
import {ReactNode} from "react";
import LandingHeader from "@/components/landing_header/header";
import LandingFooter from "@/components/landing_footer/footer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (<div className={"scroll-hidden"}>
        <LandingHeader/>
        <main>{children}</main>
        <div className={"absolute z-[999999] w-full h-fit"}>
            <LandingFooter/>
        </div>
    </div>);
}