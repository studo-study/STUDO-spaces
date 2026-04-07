
import {ReactNode} from "react";
import LandingHeader from "@/components/pages/marketing/landing_header/header";
import LandingFooter from "@/components/pages/marketing/landing_footer/footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
    return (<div className={"scroll-hidden"}>
        <LandingHeader/>
        <main>{children}</main>
        <div className={"absolute z-[999999] w-full h-fit"}>
            <LandingFooter/>
        </div>
    </div>);
}