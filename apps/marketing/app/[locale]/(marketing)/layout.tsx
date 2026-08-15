import { ReactNode } from "react";
import LandingHeader from "@/components/ui/app/public/landing_header/header";
import LandingFooter from "@/components/ui/app/public/landing_footer/footer";
import IcoSwitcher from "@/components/ui/overige/effects/IcoSwitcher";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"scroll-hidden"}>
      <IcoSwitcher />
      <LandingHeader />
      <main>{children}</main>
      <div className={"absolute z-999999 w-full h-fit scroll-hidden"}>
        <LandingFooter />
      </div>
    </div>
  );
}
